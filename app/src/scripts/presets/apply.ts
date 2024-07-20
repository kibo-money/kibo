import { requestIdleCallbackPossible } from "/src/env";
import { createRWS } from "/src/solid/rws";

import { chunkIdToIndex } from "../datasets/resource";
import {
  createBaseLineSeries,
  DEFAULT_BASELINE_COLORS,
} from "../lightweightCharts/baseLine";
import { createCandlesticksSeries } from "../lightweightCharts/candlesticks";
import { createChart } from "../lightweightCharts/create";
import { createHistogramSeries } from "../lightweightCharts/histogram";
import { createSeriesLegend } from "../lightweightCharts/legend";
import { createLineSeries } from "../lightweightCharts/line";
import { setMinMaxMarkers } from "../lightweightCharts/markers";
import {
  getInitialTimeRange,
  initTimeScale,
  setActiveIds,
  setInitialTimeRange,
} from "../lightweightCharts/time";
import { setWhitespace } from "../lightweightCharts/whitespace";
import { colors } from "../utils/colors";
import { dateFromTime, getNumberOfDaysBetweenTwoDates } from "../utils/date";
import { debounce } from "../utils/debounce";
import { stringToId } from "../utils/id";
import { webSockets } from "../ws";
import { SeriesType } from "./enums";

export function applySeriesList({
  parentDiv,
  charts: reactiveChartList,
  top,
  bottom,
  preset,
  priceScaleOptions,
  datasets,
  priceDataset,
  priceOptions,
  legendSetter,
  dark,
  activeIds,
}: {
  charts: RWS<IChartApi[]>;
  parentDiv: HTMLDivElement;
  preset: Preset;
  legendSetter: Setter<SeriesLegend[]>;
  priceDataset?: AnyDatasetPath;
  priceOptions?: PriceSeriesOptions;
  // priceScaleOptions?: DeepPartialPriceScaleOptions;
  // top?: SeriesConfig<Scale>[];
  // bottom?: SeriesConfig<Scale>[];
  datasets: Datasets;
  dark: Accessor<boolean>;
  activeIds: RWS<number[]>;
} & PresetParams) {
  // ---
  // Reset states
  // ---

  legendSetter([]);

  reactiveChartList.set((charts) => {
    charts.forEach((chart) => {
      chart.remove();
    });

    return [];
  });

  parentDiv.replaceChildren();

  // ---
  // Done
  // ---

  const scale = preset.scale;

  const presetLegend: SeriesLegend[] = [];

  const priceSeriesType = createRWS<PriceSeriesType>("Candlestick");

  const activeDatasets: ResourceDataset<any, any>[] = [];

  const lastActiveIndex = createMemo(() => {
    const last = activeIds().at(-1);
    return last !== undefined ? chunkIdToIndex(scale, last) : undefined;
  });

  const exactRange = createRWS(getInitialTimeRange(scale));

  setActiveIds({
    exactRange: exactRange(),
    activeIds: activeIds,
  });

  const seriesNumber = 1 + (top || []).length + (bottom || []).length;

  const charts = [top || [], bottom]
    .flatMap((list) => (list ? [list] : []))
    .flatMap((seriesConfigList, chartIndex) => {
      if (chartIndex !== 0 && seriesConfigList.length === 0) {
        return [];
      }

      const div = document.createElement("div");

      div.className = "w-full cursor-crosshair min-h-0 border-lighter h-full";

      parentDiv.appendChild(div);

      const chart = createChart(scale, div, {
        dark,
        priceScaleOptions,
      });

      if (!chart) {
        console.log("chart: undefined");
        return [];
      }

      const whitespace = setWhitespace(chart, scale);

      const range = exactRange();

      setInitialTimeRange({ chart, range });

      if (chartIndex === 0) {
        initTimeScale({
          scale,
          chart,
          activeIds: activeIds,
          exactRange,
        });

        if (range) {
          updateVisiblePriceSeriesType({
            scale,
            chart,
            priceSeriesType,
            timeRange: range,
          });
        }
      }

      // const whitespace = new Array<ISeriesApi<"Line"> | undefined>(
      //   scale === "date"
      //     ? whitespaceDateDatasets.length
      //     : whitespaceHeightDatasets.length,
      // ).fill(undefined);

      // function createWhitespaceSeriesIfNeeded(index: number) {
      //   console.log(index);
      //   if (index >= 0 && index < whitespace.length && !whitespace[index]) {
      //     const series = createLineSeries(chart);
      //     whitespace[index] = series;

      //     if (scale === "date") {
      //       series.setData(whitespaceDateDatasets[index]);
      //     } else {
      //       series.setData(whitespaceHeightDatasets[index]);
      //     }
      //   }
      // }

      // createEffect(() => {
      //   const ids = activeIds();
      //   console.log(ids);

      //   const idsLength = ids.length;
      //   for (let i = 0; i < idsLength; i++) {
      //     const id = ids[i];

      //     const whitespaceIndex = chunkIdToIndex(
      //       scale,
      //       scale === "date"
      //         ? id - whitespaceStartDateYear
      //         : id - whitespaceHeightStart,
      //     );

      //     if (i === 0) {
      //       createWhitespaceSeriesIfNeeded(whitespaceIndex - 1);
      //     }

      //     createWhitespaceSeriesIfNeeded(whitespaceIndex);

      //     if (i === idsLength - 1) {
      //       createWhitespaceSeriesIfNeeded(whitespaceIndex + 1);
      //     }
      //   }
      // });

      const chartLegend: SeriesLegend[] = [];

      onCleanup(() => {
        chartLegend.length = 0;
      });

      const markerCallback = () =>
        setMinMaxMarkers({
          scale,
          visibleRange: exactRange(),
          legendList: chartLegend,
          dark,
          activeIds: activeIds,
        });

      const debouncedSetMinMaxMarkers = requestIdleCallbackPossible
        ? () => requestIdleCallback(markerCallback)
        : debounce(
            markerCallback,
            seriesNumber * 10 + scale === "date" ? 50 : 100,
          );

      createEffect(on([exactRange, dark], debouncedSetMinMaxMarkers));

      if (chartIndex === 0) {
        const datasetPath =
          priceDataset || (`/${scale}-to-price` satisfies AnyDatasetPath);

        const dataset = datasets.getOrImport(scale, datasetPath);

        activeDatasets.push(dataset);

        const title = priceOptions?.title || "Price";

        const priceScaleOptions: DeepPartialPriceScaleOptions = {
          mode: 1,
          ...priceOptions?.priceScaleOptions,
        };

        function createPriceSeries(seriesType: PriceSeriesType) {
          let seriesConfig: SeriesConfig;

          if (seriesType === "Candlestick") {
            seriesConfig = {
              // @ts-ignore
              datasetPath,
              title,
              seriesType: SeriesType.Candlestick,
              options: priceOptions,
              priceScaleOptions,
            };
          } else {
            seriesConfig = {
              // @ts-ignore
              datasetPath,
              title,
              color: colors.white,
              options: priceOptions?.seriesOptions,
              priceScaleOptions,
            };
          }

          const priceSeries = createSeriesGroup({
            scale,
            datasets,
            index: -1,
            activeIds,
            seriesConfig,
            chart,
            chartLegend,
            lastActiveIndex,
            preset,
            disabled: () => priceSeriesType() !== seriesType,
            debouncedSetMinMaxMarkers,
            dark,
          });

          createEffect(() => {
            const latest = webSockets.liveKrakenCandle.latest();

            if (!latest) return;

            const index = chunkIdToIndex(scale, latest.year);

            const series = priceSeries.seriesList.at(index)?.();

            series?.update(latest);
          });

          return priceSeries;
        }

        const priceCandlestickLegend = createPriceSeries("Candlestick");
        const priceLineLegend = createPriceSeries("Line");

        createEffect(() => {
          priceCandlestickLegend.visible.set(priceLineLegend.visible());
        });

        createEffect(() => {
          priceLineLegend.visible.set(priceCandlestickLegend.visible());
        });
      }

      [...seriesConfigList].reverse().forEach((seriesConfig, index) => {
        const dataset = datasets.getOrImport(scale, seriesConfig.datasetPath);

        activeDatasets.push(dataset);

        createSeriesGroup({
          scale,
          datasets,
          activeIds: activeIds,
          index,
          seriesConfig,
          chartLegend,
          chart,
          preset,
          lastActiveIndex,
          debouncedSetMinMaxMarkers,
          dark,
        });
      });

      chartLegend.forEach((legend) => {
        presetLegend.splice(0, 0, legend);

        createEffect(on(legend.visible, debouncedSetMinMaxMarkers));
      });

      return [
        {
          scale,
          div,
          chart,
          whitespace,
          legendList: chartLegend,
          debouncedSetMinMaxMarkers,
        },
      ];
    }) satisfies ChartObject[];

  createEffect(() => {
    const visibleCharts: typeof charts = [];

    charts.forEach((chart) => {
      if (chart.legendList.some((legend) => legend.drawn())) {
        chart.div.style.border = "";
        chart.div.style.maxHeight = "100%";
        visibleCharts.push(chart);
      } else {
        // chart.div.style.height = "100%";
        chart.div.style.maxHeight = "0px";
        chart.div.style.border = "none";
      }
    });

    visibleCharts.forEach(({ div, chart }, index) => {
      const last = index === visibleCharts.length - 1;

      div.style.height = last ? "100%" : "calc(100% - 62px)";
      div.style.borderBottomWidth = last ? "none" : "1px";
      div.style.marginBottom = last ? "" : "-2px";

      chart.timeScale().applyOptions({
        visible: last,
      });
    });
  });

  const debouncedUpdateVisiblePriceSeriesType = debounce(
    updateVisiblePriceSeriesType,
    50,
  );

  const activeDatasetsLength = activeDatasets.length;
  createEffect(() => {
    const range = activeIds();

    untrack(() => {
      for (let i = 0; i < range.length; i++) {
        const id = range[i];
        for (let j = 0; j < activeDatasetsLength; j++) {
          activeDatasets[j].fetch(id);
        }
      }
    });
  });

  const lastChartIndex = charts.length - 1;

  for (let i = 0; i < charts.length; i++) {
    const chart = charts[i].chart;

    chart.timeScale().subscribeVisibleLogicalRangeChange((logicalRange) => {
      if (!logicalRange) return;

      // Must be the chart with the visible timeScale
      if (i === lastChartIndex) {
        debouncedUpdateVisiblePriceSeriesType({
          scale,
          chart,
          logicalRange,
          priceSeriesType,
        });
      }

      for (let j = 0; j <= lastChartIndex; j++) {
        if (i !== j) {
          charts[j].chart.timeScale().setVisibleLogicalRange(logicalRange);
        }
      }
    });

    chart.subscribeCrosshairMove(({ time, sourceEvent }) => {
      // Don't override crosshair position from scroll event
      if (time && !sourceEvent) return;

      for (let j = 0; j <= lastChartIndex; j++) {
        const whitespace = charts[j].whitespace;
        const otherChart = charts[j].chart;

        if (whitespace && i !== j) {
          if (time) {
            otherChart.setCrosshairPosition(NaN, time, whitespace);
          } else {
            // No time when mouse goes outside the chart
            otherChart.clearCrosshairPosition();
          }
        }
      }
    });
  }

  legendSetter(presetLegend);

  reactiveChartList.set(() => charts.map(({ chart }) => chart));
}

export function updateVisiblePriceSeriesType({
  scale,
  chart,
  logicalRange,
  timeRange,
  priceSeriesType,
}: {
  scale: ResourceScale;
  chart: IChartApi;
  logicalRange?: LogicalRange;
  timeRange?: TimeRange;
  priceSeriesType: RWS<PriceSeriesType>;
}) {
  try {
    const width = chart.timeScale().width();

    let ratio: number;

    if (logicalRange) {
      ratio = (logicalRange.to - logicalRange.from) / width;
    } else if (timeRange) {
      if (scale === "date") {
        ratio = getNumberOfDaysBetweenTwoDates(
          dateFromTime(timeRange.from),
          dateFromTime(timeRange.to),
        );
      } else {
        ratio = ((timeRange.to as number) - (timeRange.from as number)) / width;
      }
    } else {
      throw Error();
    }

    if (ratio <= 0.5) {
      priceSeriesType.set("Candlestick");
    } else {
      priceSeriesType.set("Line");
    }
  } catch {}
}

function createSeriesGroup<Scale extends ResourceScale>({
  scale,
  datasets,
  activeIds,
  seriesConfig,
  preset,
  chartLegend,
  chart,
  index: seriesIndex,
  disabled,
  lastActiveIndex,
  debouncedSetMinMaxMarkers,
  dark,
}: {
  scale: Scale;
  datasets: Datasets;
  activeIds: Accessor<number[]>;
  seriesConfig: SeriesConfig;
  preset: Preset;
  chart: IChartApi;
  index: number;
  chartLegend: SeriesLegend[];
  lastActiveIndex: Accessor<number | undefined>;
  disabled?: Accessor<boolean>;
  debouncedSetMinMaxMarkers: VoidFunction;
  dark: Accessor<boolean>;
}) {
  const {
    datasetPath,
    title,
    colors,
    color,
    defaultVisible,
    seriesType: type,
    options,
    priceScaleOptions,
  } = seriesConfig;

  const dataset = datasets.getOrImport(
    scale,
    datasetPath as DatasetPath<Scale>,
  );

  const seriesList: RWS<
    ISeriesApi<"Baseline" | "Line" | "Histogram" | "Candlestick"> | undefined
  >[] = new Array(dataset.fetchedJSONs.length);

  const legend = createSeriesLegend({
    scale,
    id: stringToId(title),
    presetId: preset.id,
    title,
    seriesList,
    color: colors || color || DEFAULT_BASELINE_COLORS,
    defaultVisible,
    disabled,
    dataset,
  });

  chartLegend.push(legend);

  dataset.fetchedJSONs.forEach((json, index) => {
    const series: (typeof seriesList)[number] = createRWS(undefined);

    seriesList[index] = series;

    createEffect(() => {
      const values = json.vec();

      if (!values) return;

      if (seriesIndex > 0) {
        let previous = chartLegend.at(seriesIndex - 1)?.seriesList[index];

        if (!previous?.()) {
          return;
        }
      }

      untrack(() => {
        let s = series();

        if (!s) {
          switch (type) {
            case SeriesType.Based: {
              s = createBaseLineSeries({
                chart,
                dark,
                color,
                topColor: seriesConfig.topColor,
                bottomColor: seriesConfig.bottomColor,
                options,
              });

              break;
            }
            case SeriesType.Candlestick: {
              const candlestickSeries = createCandlesticksSeries({
                chart,
                options,
                dark,
              });

              s = candlestickSeries[0];

              if (!colors && !color) {
                legend.color = candlestickSeries[1];
              }

              break;
            }
            case SeriesType.Histogram: {
              s = createHistogramSeries({
                chart,
                options,
              });

              break;
            }
            default:
            case SeriesType.Line: {
              s = createLineSeries({
                chart,
                color,
                dark,
                options,
              });

              break;
            }
          }

          if (priceScaleOptions) {
            s.priceScale().applyOptions(priceScaleOptions);
          }

          series.set(s);
        }

        s.setData(values);

        debouncedSetMinMaxMarkers();
      });
    });

    createEffect(() => {
      const s = series();
      const currentVec = dataset.fetchedJSONs.at(index)?.vec();
      const nextVec = dataset.fetchedJSONs.at(index + 1)?.vec();

      if (s && currentVec?.length && nextVec?.length) {
        s.update(nextVec[0]);
      }
    });

    const isLast = createMemo(() => {
      const last = lastActiveIndex();
      return last !== undefined && last === index;
    });

    createEffect(() => {
      series()?.applyOptions({
        lastValueVisible: legend.drawn() && isLast(),
      });
    });

    const inRange = createMemo(() => {
      const range = activeIds();

      if (range.length) {
        const start = chunkIdToIndex(scale, range.at(0)!);
        const end = chunkIdToIndex(scale, range.at(-1)!);

        if (index >= start && index <= end) {
          return true;
        }
      }

      return false;
    });

    const visible = createMemo((previous: boolean) => {
      if (legend.disabled()) {
        return false;
      }

      return previous || inRange();
    }, false);

    createEffect(() => {
      series()?.applyOptions({
        visible: legend.drawn() && visible(),
      });
    });
  });

  return legend;
}
