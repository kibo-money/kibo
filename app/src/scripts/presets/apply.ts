import { createRWS } from "/src/solid/rws";

import { createChart } from "../lightweightCharts/chart/create";
import { applyPriceSeries } from "../lightweightCharts/chart/price";
import { chartState } from "../lightweightCharts/chart/state";
import { setWhitespace } from "../lightweightCharts/chart/whitespace";
import { createAreaSeries } from "../lightweightCharts/series/creators/area";
import {
  createBaseLineSeries,
  DEFAULT_BASELINE_COLORS,
} from "../lightweightCharts/series/creators/baseLine";
import { createHistogramSeries } from "../lightweightCharts/series/creators/histogram";
import { createSeriesLegend } from "../lightweightCharts/series/creators/legend";
import { createLineSeries } from "../lightweightCharts/series/creators/line";
import { debounce } from "../utils/debounce";
import { stringToId } from "../utils/id";

export enum SeriesType {
  Normal,
  Based,
  Area,
  Histogram,
}

type SeriesConfig<Scale extends ResourceScale> =
  | {
      dataset: AnyDataset<Scale>;
      color?: string;
      colors?: undefined;
      seriesType: SeriesType.Based;
      title: string;
      options?: BaselineSeriesOptions;
      defaultVisible?: boolean;
    }
  | {
      dataset: AnyDataset<Scale>;
      color?: string;
      colors?: string[];
      seriesType: SeriesType.Histogram;
      title: string;
      options?: DeepPartialHistogramOptions;
      defaultVisible?: boolean;
    }
  | {
      dataset: AnyDataset<Scale>;
      color: string;
      colors?: undefined;
      seriesType?: SeriesType.Normal | SeriesType.Area;
      title: string;
      options?: DeepPartialLineOptions;
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
  activeResources,
  legendSetter,
}: {
  charts: RWS<IChartApi[]>;
  parentDiv: HTMLDivElement;
  preset: Preset;
  legendSetter: Setter<PresetLegend>;
  priceDataset?: AnyDataset<Scale>;
  priceOptions?: PriceSeriesOptions;
  priceScaleOptions?: DeepPartialPriceScaleOptions;
  top?: SeriesConfig<Scale>[];
  bottom?: SeriesConfig<Scale>[];
  datasets: Datasets;
  activeResources: Accessor<Set<ResourceDataset<any, any>>>;
}) {
  reactiveChartList.set((charts) => {
    charts.forEach((chart) => {
      chart.remove();
    });

    return [];
  });

  parentDiv.replaceChildren();

  const scale = preset.scale;

  const legendList: PresetLegend = [];

  const priceSeriesType = createRWS<"Candlestick" | "Line">("Candlestick");

  const valuesSkipped = createRWS(0);

  const charts = [top || [], bottom]
    .flatMap((list) => (list ? [list] : []))
    .flatMap((seriesConfigList, index, array) => {
      if (index !== 0 && seriesConfigList.length === 0) {
        return [];
      }

      const isAnyArea = seriesConfigList.find(
        (config) => config.seriesType === SeriesType.Area,
      );

      const div = document.createElement("div");

      div.className = "w-full cursor-crosshair min-h-0 border-orange-200/10";

      parentDiv.appendChild(div);

      const chart = createChart(scale, div, {
        ...priceScaleOptions,
        ...(isAnyArea
          ? {
              scaleMargins: {
                bottom: 0,
              },
            }
          : {}),
      });

      chartState.chart = chart;

      if (!chart) {
        console.log("chart: undefined");
        return [];
      }

      setWhitespace(chart, scale);

      const seriesList: ISeriesApi<any>[] = [];

      const _legendList: PresetLegend = [];

      if (index === 0) {
        const price = applyPriceSeries({
          chart,
          preset,
          seriesType: priceSeriesType,
          valuesSkipped,
          dataset:
            priceDataset ||
            (datasets[preset.scale as Scale].price as unknown as NonNullable<
              typeof priceDataset
            >),
          activeResources,
          options: priceOptions,
        });

        _legendList.push(price.lineLegend, price.ohlcLegend);

        seriesList.push(price.lineLegend.series, price.ohlcLegend.series);
      }

      seriesList.push(
        ...seriesConfigList
          .reverse()
          .map(
            ({
              dataset,
              color,
              colors,
              seriesType: type,
              title,
              options,
              defaultVisible,
            }) => {
              let series: ISeriesApi<
                "Baseline" | "Line" | "Area" | "Histogram"
              >;

              if (type === SeriesType.Based) {
                series = createBaseLineSeries(chart, {
                  color,
                  ...options,
                });
              } else if (type === SeriesType.Area) {
                series = createAreaSeries(chart, {
                  color,
                  autoscaleInfoProvider: (
                    getInfo: () => AutoscaleInfo | null,
                  ) => {
                    const info = getInfo();
                    if (info) {
                      info.priceRange.minValue = 0;
                    }
                    return info;
                  },
                  ...options,
                });
              } else if (type === SeriesType.Histogram) {
                series = createHistogramSeries(chart, {
                  color,
                  ...options,
                });
              } else {
                series = createLineSeries(chart, {
                  color,
                  ...options,
                });
              }

              _legendList.push(
                createSeriesLegend({
                  id: stringToId(title),
                  presetId: preset.id,
                  title,
                  series,
                  color: () => colors || color || DEFAULT_BASELINE_COLORS,
                  defaultVisible,
                  url: dataset.url,
                }),
              );

              createEffect(() => {
                series.setData(
                  dataset?.values() || [],
                  // computeDrawnSeriesValues(dataset?.values(), valuesSkipped()),
                );
              });

              return series;
            },
          ),
      );

      _legendList.forEach((legend) => {
        legendList.splice(0, 0, legend);
      });

      return [{ div, chart, seriesList, legendList: _legendList }];
    });

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

  // const seriesType = createRWS(
  //   checkIfUpClose(chart, chartState.range) || "Candlestick",
  // );

  function updateVisibleRangeRatio(
    chart: IChartApi,
    range: LogicalRange | null,
  ) {
    if (!range) return;

    try {
      const width = chart.timeScale().width();

      const ratio = (range.to - range.from) / width;

      if (ratio <= 0.5) {
        priceSeriesType.set("Candlestick");
      } else {
        priceSeriesType.set("Line");

        valuesSkipped.set(Math.floor(ratio / 5));
      }
    } catch {}
  }

  const debouncedUpdateVisibleRangeRatio = debounce(
    updateVisibleRangeRatio,
    50,
  );

  charts.forEach(({ chart }, index) => {
    chart.timeScale().subscribeVisibleLogicalRangeChange((timeRange) => {
      // Last chart otherwise length of timescale is Infinity
      if (index === charts.length - 1) {
        debouncedUpdateVisibleRangeRatio(chart, timeRange);
      }

      charts.forEach(({ chart: _chart }, _index) => {
        if (timeRange && index !== _index) {
          _chart.timeScale().setVisibleLogicalRange(timeRange);
        }
      });
    });

    chart.subscribeCrosshairMove(({ time, sourceEvent }) => {
      // Don't override crosshair position from scroll event
      if (time && !sourceEvent) return;

      charts.forEach(({ chart: _chart, seriesList }, _index) => {
        const first = seriesList.at(0);

        if (first && index !== _index) {
          if (time) {
            _chart.setCrosshairPosition(NaN, time, first);
          } else {
            // No time when mouse goes outside the chart
            _chart.clearCrosshairPosition();
          }
        }
      });
    });
  });

  legendSetter(legendList);

  reactiveChartList.set(() => charts.map(({ chart }) => chart));
}

export function computeDrawnSeriesValues<T>(
  values: DatasetValue<T>[] | undefined,
  valuesSkipped: number,
) {
  values = values || [];

  if (valuesSkipped === 0) {
    return values;
  } else {
    const valuesSkippedPlus1 = valuesSkipped + 1;

    // console.log(_valuesSkippedPlus1);

    let length = Math.floor(values.length / valuesSkippedPlus1);

    // console.log(length);

    const filteredValues = new Array(length);

    for (let i = 0; i < length; i++) {
      filteredValues[i] = values[i * valuesSkippedPlus1];
    }

    // console.log(filteredValues.length);

    return filteredValues;
  }
}
