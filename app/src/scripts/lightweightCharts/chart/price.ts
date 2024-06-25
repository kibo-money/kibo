import { createRWS } from "/src/solid/rws";

import { colors } from "../../utils/colors";
import { getNumberOfDaysBetweenTwoDates } from "../../utils/date";
import { debounce } from "../../utils/debounce";
import { webSockets } from "../../ws";
import { createCandlesticksSeries } from "../series/creators/candlesticks";
import { createSeriesLegend } from "../series/creators/legend";
import { createLineSeries } from "../series/creators/line";
import { setMinMaxMarkers } from "./markers";
import { chartState } from "./state";
import { initTimeScale } from "./time";

export const PRICE_SCALE_MOMENTUM_ID = "momentum";

export const applyPriceSeries = <
  Scale extends ResourceScale,
  T extends SingleValueData,
>({
  chart,
  datasets,
  preset,
  dataset: _dataset,
  options,
  activeResources,
}: {
  chart: IChartApi;
  datasets: Datasets;
  preset: Preset;
  activeResources: Accessor<Set<ResourceDataset<any, any>>>;
  dataset?: Dataset<Scale, T>;
  options?: PriceSeriesOptions;
}) => {
  const id = options?.id || "price";
  const title = options?.title || "Price";

  const dataset = _dataset || datasets[preset.scale].price;

  const url = "url" in dataset ? (dataset as any).url : undefined;

  const priceScaleOptions: DeepPartial<PriceScaleOptions> = {
    ...(options?.halved
      ? {
          scaleMargins: {
            top: 0.05,
            bottom: 0.55,
          },
        }
      : {}),
    ...(options?.id || options?.title
      ? {}
      : {
          mode: 1,
        }),
    ...options?.priceScaleOptions,
  };

  const seriesType = createRWS(
    checkIfUpClose(chart, chartState.range) || "Candlestick",
  );

  const debouncedCallback = debounce((range: TimeRange | null) => {
    try {
      seriesType.set((previous) => checkIfUpClose(chart, range) || previous);
    } catch {}
  }, 50);

  chart?.timeScale().subscribeVisibleTimeRangeChange(debouncedCallback);

  onCleanup(
    () =>
      chart === chartState.chart &&
      chartState.chart
        ?.timeScale()
        .unsubscribeVisibleTimeRangeChange(debouncedCallback),
  );

  const lowerOpacity = options?.lowerOpacity || options?.halved || false;

  if (options?.halved) {
    options.seriesOptions = {
      ...options.seriesOptions,
      priceScaleId: "left",
    };
  }

  const [ohlcSeries, ohlcColors] = createCandlesticksSeries(chart, {
    ...options,
    lowerOpacity,
  });

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

  const lineColor = lowerOpacity ? colors.darkWhite : colors.white;

  const lineSeries = createLineSeries(chart, {
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

  // ---

  // setMinMaxMarkers({
  //   scale: preset.scale,
  //   candlesticks:
  //     dataset?.values() || datasets[preset.scale].price.values() || ([] as any),
  //   range: chartState.range,
  //   lowerOpacity,
  // });

  initTimeScale({
    activeResources,
  });

  createEffect(() => {
    const values = dataset.values();

    if (values) {
      lineSeries.setData(values);
      ohlcSeries.setData(values);
    }
  });

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
};

function checkIfUpClose(chart: IChartApi, range?: TimeRange | null) {
  if (!range) return undefined;

  const from = new Date(range.from);
  const to = new Date(range.to);

  const width = chart.timeScale().width();

  const difference = getNumberOfDaysBetweenTwoDates(from, to);

  return width / difference >= 2.05
    ? "Candlestick"
    : width / difference <= 1.95
      ? "Line"
      : undefined;
}
