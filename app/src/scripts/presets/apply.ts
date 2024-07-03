import { createRWS } from "/src/solid/rws";

import { createChart } from "../lightweightCharts/chart/create";
import { chartState } from "../lightweightCharts/chart/state";
import { initTimeScale } from "../lightweightCharts/chart/time";
import { setWhitespace } from "../lightweightCharts/chart/whitespace";
import { createAreaSeries } from "../lightweightCharts/series/creators/area";
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
import { webSockets } from "../ws";

export enum SeriesType {
  Normal,
  Based,
  Area,
  Histogram,
}

type SeriesConfig<Scale extends ResourceScale> =
  | {
      dataset: ResourceDataset<Scale>;
      color?: string;
      colors?: undefined;
      seriesType: SeriesType.Based;
      title: string;
      options?: BaselineSeriesOptions;
      defaultVisible?: boolean;
    }
  | {
      dataset: ResourceDataset<Scale>;
      color?: string;
      colors?: string[];
      seriesType: SeriesType.Histogram;
      title: string;
      options?: DeepPartialHistogramOptions;
      defaultVisible?: boolean;
    }
  | {
      dataset: ResourceDataset<Scale>;
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
  legendSetter,
}: {
  charts: RWS<IChartApi[]>;
  parentDiv: HTMLDivElement;
  preset: Preset;
  legendSetter: Setter<PresetLegend>;
  priceDataset?: ResourceDataset<Scale>;
  priceOptions?: PriceSeriesOptions;
  priceScaleOptions?: DeepPartialPriceScaleOptions;
  top?: SeriesConfig<Scale>[];
  bottom?: SeriesConfig<Scale>[];
  datasets: Datasets;
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

  // const valuesSkipped = createRWS(0);

  const activeDatasets: Set<ResourceDataset<any, any>> = new Set();

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
        const dataset =
          priceDataset ||
          (datasets[preset.scale as Scale].price as unknown as NonNullable<
            typeof priceDataset
          >);

        activeDatasets.add(dataset);

        const price = applyPriceSeries({
          chart,
          preset,
          seriesType: priceSeriesType,
          // valuesSkipped,
          dataset,
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
              activeDatasets.add(dataset);

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
                const values = dataset.values();
                console.log(values.length);

                series.setData(values);
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
        // valuesSkipped.set(0);

        priceSeriesType.set("Candlestick");
      } else {
        priceSeriesType.set("Line");

        // valuesSkipped.set(Math.floor(ratio / 1.25));
      }
    } catch {}
  }

  const debouncedUpdateVisibleRangeRatio = debounce(
    updateVisibleRangeRatio,
    50,
  );

  initTimeScale({
    activeDatasets,
  });

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

function applyPriceSeries<
  Scale extends ResourceScale,
  T extends OHLC | number,
>({
  chart,
  preset,
  dataset,
  seriesType,
  // valuesSkipped,
  options,
}: {
  chart: IChartApi;
  preset: Preset;
  // valuesSkipped: Accessor<number>;
  seriesType: Accessor<"Candlestick" | "Line">;
  dataset: ResourceDataset<Scale, T>;
  options?: PriceSeriesOptions;
}) {
  // console.time("series add");

  const id = options?.id || "price";
  const title = options?.title || "Price";

  const url = "url" in dataset ? (dataset as any).url : undefined;

  const priceScaleOptions: DeepPartialPriceScaleOptions = {
    mode: 1,
    ...options?.priceScaleOptions,
  };

  let [ohlcSeries, ohlcColors] = createCandlesticksSeries(chart, options);

  const ohlcLegend = createSeriesLegend({
    id,
    presetId: preset.id,
    title,
    color: () => ohlcColors,
    series: ohlcSeries,
    disabled: () => seriesType() !== "Candlestick",
    url,
  });

  ohlcSeries.priceScale().applyOptions(priceScaleOptions);

  // ---

  const lineColor = colors.white;

  let lineSeries = createLineSeries(chart, {
    color: lineColor,
    ...options?.seriesOptions,
  });

  const lineLegend = createSeriesLegend({
    id,
    presetId: preset.id,
    title,
    color: () => lineColor,
    series: lineSeries,
    disabled: () => seriesType() !== "Line",
    visible: ohlcLegend.visible,
    url,
  });

  lineSeries.priceScale().applyOptions(priceScaleOptions);

  // console.timeEnd("series add");

  // lineSeries.setData(whitespaceHeightDataset);
  // ohlcSeries.setData({ time: 0, value: NaN });

  // ---

  // setMinMaxMarkers({
  //   scale: preset.scale,
  //   candlesticks:
  //     dataset?.values() || datasets[preset.scale].price.values() || ([] as any),
  //   range: chartState.range,
  //   lowerOpacity,
  // });

  // const startingValue = {
  //   number: -1,
  //   time: -1,
  //   open: NaN,
  //   high: NaN,
  //   low: NaN,
  //   close: NaN,
  //   value: NaN,
  // };
  // lineSeries.update(startingValue);
  // ohlcSeries.update(startingValue);

  // const callback = (
  //   chunks: any[],
  //   valuesSkippedPlus1: number,
  //   length: number,
  // ) => {
  //   console.time("t");
  //   console.time("a");
  //   // chart.removeSeries(ohlcSeries);
  //   // chart.removeSeries(lineSeries);

  //   // ohlcSeries = createCandlesticksSeries(chart, options)[0];

  //   // ohlcSeries.priceScale().applyOptions(priceScaleOptions);

  //   // lineSeries = createLineSeries(chart, {
  //   //   color: lineColor,
  //   //   ...options?.seriesOptions,
  //   // });

  //   // lineSeries.priceScale().applyOptions(priceScaleOptions);

  //   const values = new Array(length);

  //   let i = 0;
  //   for (let k = 0; k < chunks.length; k++) {
  //     const chunk = chunks[k];
  //     // const chunk =
  //     //   fetchedJSONs[chunkIdToIndex(dataset.scale, activeRange[k])]?.vec?.() ||
  //     //   [];

  //     for (let j = 0; j < chunk.length; j += valuesSkippedPlus1) {
  //       values[i++] = chunk[j];
  //       // console.log(chunk[j]);
  //       // callback(chunk[j]);
  //       // for (let i = 0; i < seriesList.length; i++) {
  //       //   seriesList[i].update(chunk[j]);
  //       // }
  //       // const value = chunk[j];
  //       // console.log(value.time);
  //       // lineSeries.update(value);
  //       // ohlcSeries.update(value);

  //       // i++;
  //     }
  //   }

  //   console.log(values.length);
  //   console.timeEnd("t");

  //   lineSeries.setData(values);

  //   console.timeEnd("a");
  // };

  // const debouncedCallback = debounce(callback, 200);

  createEffect(() => {
    const values = dataset.values();
    console.log(values.length);
    lineSeries.setData(values);
    ohlcSeries.setData(values);
  });
  // createEffect(() =>
  //   computeDrawnSeriesValues(
  //     dataset,
  //     valuesSkipped(),
  //     debouncedCallback,
  //     // [lineSeries, ohlcSeries],
  //     // (value) => {
  //     // try {
  //     // console.log(value);
  //     // lineSeries.update(value);
  //     // ohlcSeries.update(value);
  //     // } catch {}
  //     // }),
  //   ),
  // );

  createEffect(() => {
    if (preset.scale === "date") {
      const latest = webSockets.liveKrakenCandle.latest();

      if (latest) {
        ohlcSeries.update(latest);
        lineSeries.update(latest);
      }
    }
  });

  return { ohlcLegend, lineLegend };
}

// // const computeDrawnSeriesValues = debounce(_computeDrawnSeriesValues, 100);

// function computeDrawnSeriesValues<
//   S extends ResourceScale,
//   T extends OHLC | number,
// >(
//   dataset: ResourceDataset<S, T>,
//   valuesSkipped: number,
//   callback: (chunks: any, v: number, l: number) => void,
//   // seriesList: ISeriesApi<any>[],
// ) {
//   // console.time(dataset.url);

//   const { fetchedJSONs, activeRange: _activeRange } = dataset;

//   const activeRange = _activeRange();

//   const valuesSkippedPlus1 = valuesSkipped + 1;

//   if (valuesSkippedPlus1 === 1) {
//     console.log("todo valuesSkippedPlus1===1, skip for now");
//   }

//   // for (let i = 0; i < seriesList.length; i++) {
//   //   seriesList[i].
//   // }

//   const chunks = new Array(activeRange.length);
//   let length = 0;

//   for (let i = 0; i < chunks.length; i++) {
//     const chunk =
//       fetchedJSONs[chunkIdToIndex(dataset.scale, activeRange[i])]?.vec?.() ||
//       [];

//     chunks[i] = chunk;

//     length += Math.ceil(chunk.length / valuesSkippedPlus1);
//   }

//   callback(chunks, valuesSkippedPlus1, length);

//   //   setValues(chunks, valuesSkippedPlus1, length, callback);
//   // }

//   // // const debouncedSetValues = debounce(setValues, 50);
//   // function setValues(
//   //   chunks: any[],
//   //   valuesSkippedPlus1: number,
//   //   length: number,
//   //   callback: (values: any[]) => void,
//   // ) {
//   // const values = new Array(length);

//   // let i = 0;
//   // for (let k = 0; k < activeRange.length; k++) {
//   //   const chunk = chunks[k];
//   //   // const chunk =
//   //   //   fetchedJSONs[chunkIdToIndex(dataset.scale, activeRange[k])]?.vec?.() ||
//   //   //   [];

//   //   for (let j = 0; j < chunk.length; j += valuesSkippedPlus1) {
//   //     // values[i++] = chunk[j];
//   //     // console.log(chunk[j]);
//   //     // callback(chunk[j]);
//   //     for (let i = 0; i < seriesList.length; i++) {
//   //       seriesList[i].update(chunk[j]);
//   //     }

//   //     // i++;
//   //   }
//   // }

//   // console.log(i);

//   // if (i !== values.length) {
//   //   console.log({ n: i, values });
//   //   throw Error("error");
//   // }

//   // console.timeEnd(dataset.url);
// }
