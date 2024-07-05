import { createRWS } from "/src/solid/rws";

import { chunkIdToIndex } from "../datasets/resource";
import { createChart } from "../lightweightCharts/chart/create";
import { setMinMaxMarkers } from "../lightweightCharts/chart/markers";
import { initTimeScale } from "../lightweightCharts/chart/time";
import { setWhitespace } from "../lightweightCharts/chart/whitespace";
import {
  createBaseLineSeries,
  DEFAULT_BASELINE_COLORS,
} from "../lightweightCharts/series/creators/baseLine";
import { createCandlesticksSeries } from "../lightweightCharts/series/creators/candlesticks";
import { createHistogramSeries } from "../lightweightCharts/series/creators/histogram";
import { createSeriesLegend } from "../lightweightCharts/series/creators/legend";
import { createLineSeries } from "../lightweightCharts/series/creators/line";
import { colors } from "../utils/colors";
import { debounce } from "../utils/debounce";
import { stringToId } from "../utils/id";

export enum SeriesType {
  Line,
  Based,
  Histogram,
  Candlestick,
}

type SeriesConfig<Scale extends ResourceScale> =
  | {
      dataset: ResourceDataset<Scale>;
      color?: string;
      colors?: undefined;
      seriesType: SeriesType.Based;
      title: string;
      options?: BaselineSeriesOptions;
      priceScaleOptions?: DeepPartialPriceScaleOptions;
      defaultVisible?: boolean;
    }
  | {
      dataset: ResourceDataset<Scale>;
      color?: string;
      colors?: string[];
      seriesType: SeriesType.Histogram;
      title: string;
      options?: DeepPartialHistogramOptions;
      priceScaleOptions?: DeepPartialPriceScaleOptions;
      defaultVisible?: boolean;
    }
  | {
      dataset: ResourceDataset<Scale>;
      seriesType: SeriesType.Candlestick;
      priceScaleOptions?: DeepPartialPriceScaleOptions;
      colors?: undefined;
      color?: undefined;
      options?: DeepPartialLineOptions;
      defaultVisible?: boolean;
      title: string;
    }
  | {
      dataset: ResourceDataset<Scale>;
      color: string;
      colors?: undefined;
      seriesType?: SeriesType.Line;
      title: string;
      options?: DeepPartialLineOptions;
      priceScaleOptions?: DeepPartialPriceScaleOptions;
      defaultVisible?: boolean;
    };

export function applySeriesList<Scale extends ResourceScale>({
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
  activeRange,
}: {
  charts: RWS<IChartApi[]>;
  parentDiv: HTMLDivElement;
  preset: Preset;
  legendSetter: Setter<SeriesLegend[]>;
  priceDataset?: ResourceDataset<Scale>;
  priceOptions?: PriceSeriesOptions;
  priceScaleOptions?: DeepPartialPriceScaleOptions;
  top?: SeriesConfig<Scale>[];
  bottom?: SeriesConfig<Scale>[];
  datasets: Datasets;
  dark: boolean;
  activeRange: RWS<number[]>;
}) {
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

  activeRange.set([]);

  parentDiv.replaceChildren();

  // ---
  // Done
  // ---

  const scale = preset.scale;

  const presetLegend: SeriesLegend[] = [];

  const priceSeriesType = createRWS<PriceSeriesType>("Candlestick");

  const activeDatasets: ResourceDataset<any, any>[] = [];

  const lastActiveIndex = createMemo(() => {
    const last = activeRange().at(-1);
    return last !== undefined ? chunkIdToIndex(scale, last) : undefined;
  });

  const exactRange = createRWS(undefined as TimeRange | undefined);

  const charts = [top || [], bottom]
    .flatMap((list) => (list ? [list] : []))
    .flatMap((seriesConfigList, index) => {
      if (index !== 0 && seriesConfigList.length === 0) {
        return [];
      }

      const div = document.createElement("div");

      div.className = "w-full cursor-crosshair min-h-0 border-orange-200/10";

      parentDiv.appendChild(div);

      const chart = createChart(scale, div, {
        dark,
        priceScaleOptions: {
          ...priceScaleOptions,
        },
      });

      if (!chart) {
        console.log("chart: undefined");
        return [];
      }

      const whitespace = setWhitespace(chart, scale);

      // return [
      //   {
      //     scale,
      //     div,
      //     chart,
      //     whitespace,
      //     legendList: [],
      //     debouncedSetMinMaxMarkers: () => {},
      //   },
      // ];

      const chartLegend: SeriesLegend[] = [];

      const debouncedSetMinMaxMarkers = debounce(() => {
        setMinMaxMarkers({
          scale,
          visibleRange: exactRange(),
          legendList: chartLegend,
          activeRange,
        });
      }, 20);

      if (index === 0) {
        const dataset =
          priceDataset ||
          (datasets[preset.scale as Scale].price as unknown as NonNullable<
            typeof priceDataset
          >);

        activeDatasets.push(dataset);

        const title = priceOptions?.title || "Price";

        const priceScaleOptions: DeepPartialPriceScaleOptions = {
          mode: 1,
          ...priceOptions?.priceScaleOptions,
        };

        function createPriceSeries(seriesType: PriceSeriesType) {
          let seriesConfig: SeriesConfig<Scale>;

          if (seriesType === "Candlestick") {
            seriesConfig = {
              dataset,
              title,
              seriesType: SeriesType.Candlestick,
              options: priceOptions,
              priceScaleOptions,
            };
          } else {
            seriesConfig = {
              dataset,
              title,
              color: colors.white,
              options: priceOptions?.seriesOptions,
              priceScaleOptions,
            };
          }

          return createSeriesGroup({
            activeRange,
            seriesConfig,
            chart,
            chartLegend,
            lastActiveIndex,
            preset,
            disabled: () => priceSeriesType() !== seriesType,
            debouncedSetMinMaxMarkers,
          });
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

      seriesConfigList.reverse().forEach((seriesConfig) => {
        activeDatasets.push(seriesConfig.dataset);

        createSeriesGroup({
          activeRange,
          seriesConfig,
          chartLegend,
          chart,
          preset,
          lastActiveIndex,
          debouncedSetMinMaxMarkers,
        });
      });

      chartLegend.forEach((legend) => {
        presetLegend.splice(0, 0, legend);

        createEffect(on(legend.visible, debouncedSetMinMaxMarkers));
      });

      createEffect(on(exactRange, debouncedSetMinMaxMarkers));

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
        visibleCharts.push(chart);
      } else {
        chart.div.style.height = "0px";
        chart.div.style.border = "none";
      }
    });

    visibleCharts.forEach(({ div, chart }, index) => {
      const last = index === visibleCharts.length - 1;

      div.style.height = last ? "100%" : "calc(100% - 62px)";
      div.style.borderBottomWidth = last ? "none" : "1px";

      chart.timeScale().applyOptions({
        visible: last,
      });
    });
  });

  const debouncedUpdateVisiblePriceSeriesType = debounce(
    updateVisiblePriceSeriesType,
    50,
  );

  initTimeScale({
    scale,
    charts,
    activeRange,
    exactRange,
  });

  const activeDatasetsLength = activeDatasets.length;
  createEffect(() => {
    const range = activeRange();

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

    chart.timeScale().subscribeVisibleLogicalRangeChange((timeRange) => {
      if (!timeRange) return;

      // Must be the chart with the visible timeScale
      if (i === lastChartIndex) {
        debouncedUpdateVisiblePriceSeriesType(
          chart,
          timeRange,
          priceSeriesType,
        );
      }

      for (let j = 0; j <= lastChartIndex; j++) {
        if (i !== j) {
          charts[j].chart.timeScale().setVisibleLogicalRange(timeRange);
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

function updateVisiblePriceSeriesType(
  chart: IChartApi,
  range: LogicalRange,
  priceSeriesType: RWS<PriceSeriesType>,
) {
  try {
    const width = chart.timeScale().width();

    const ratio = (range.to - range.from) / width;

    if (ratio <= 0.5) {
      priceSeriesType.set("Candlestick");
    } else {
      priceSeriesType.set("Line");
    }
  } catch {}
}

function createSeriesGroup<Scale extends ResourceScale>({
  activeRange,
  seriesConfig,
  preset,
  chartLegend,
  chart,
  disabled,
  lastActiveIndex,
  debouncedSetMinMaxMarkers,
}: {
  activeRange: Accessor<number[]>;
  seriesConfig: SeriesConfig<Scale>;
  preset: Preset;
  chart: IChartApi;
  chartLegend: SeriesLegend[];
  lastActiveIndex: Accessor<number | undefined>;
  disabled?: Accessor<boolean>;
  debouncedSetMinMaxMarkers: VoidFunction;
}) {
  const {
    dataset,
    title,
    colors,
    color,
    defaultVisible,
    seriesType: type,
    options,
    priceScaleOptions,
  } = seriesConfig;

  const scale = preset.scale;

  const seriesList: RWS<
    ISeriesApi<"Baseline" | "Line" | "Histogram" | "Candlestick"> | undefined
  >[] = new Array(dataset.fetchedJSONs.length);

  let defaultSeriesColor: string | string[] | undefined = undefined;

  const legend = createSeriesLegend({
    id: stringToId(title),
    presetId: preset.id,
    title,
    seriesList,
    color: () =>
      colors || color || defaultSeriesColor || DEFAULT_BASELINE_COLORS,
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

      untrack(() => {
        let s = series();

        if (!s) {
          switch (type) {
            case SeriesType.Based: {
              s = createBaseLineSeries(chart, {
                color,
                ...options,
              });

              break;
            }
            case SeriesType.Candlestick: {
              const candlestickSeries = createCandlesticksSeries(
                chart,
                options,
              );

              s = candlestickSeries[0];
              defaultSeriesColor = candlestickSeries[1];

              break;
            }
            case SeriesType.Histogram: {
              s = createHistogramSeries(chart, {
                color,
                ...options,
              });

              break;
            }
            default:
            case SeriesType.Line: {
              s = createLineSeries(chart, {
                color,
                ...options,
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

        untrack(() => {
          debouncedSetMinMaxMarkers();
        });
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
      const range = activeRange();

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
