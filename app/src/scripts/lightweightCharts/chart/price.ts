import { colors } from "../../utils/colors";
import { webSockets } from "../../ws";
import { createCandlesticksSeries } from "../series/creators/candlesticks";
import { createSeriesLegend } from "../series/creators/legend";
import { createLineSeries } from "../series/creators/line";
import { initTimeScale } from "./time";

export const PRICE_SCALE_MOMENTUM_ID = "momentum";

export const applyPriceSeries = <
  Scale extends ResourceScale,
  T extends SingleValueData,
>({
  chart,
  preset,
  dataset,
  seriesType,
  valuesSkipped,
  options,
  activeResources,
}: {
  chart: IChartApi;
  preset: Preset;
  valuesSkipped: Accessor<number>;
  seriesType: Accessor<"Candlestick" | "Line">;
  activeResources: Accessor<Set<ResourceDataset<any, any>>>;
  dataset: Dataset<Scale, T>;
  options?: PriceSeriesOptions;
}) => {
  const id = options?.id || "price";
  const title = options?.title || "Price";

  const url = "url" in dataset ? (dataset as any).url : undefined;

  const priceScaleOptions: DeepPartialPriceScaleOptions = {
    mode: 1,
    ...options?.priceScaleOptions,
  };

  const [ohlcSeries, ohlcColors] = createCandlesticksSeries(chart, options);

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
    // const values = computeDrawnSeriesValues(dataset.values(), valuesSkipped());

    lineSeries.setData(values);
    ohlcSeries.setData(values);
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
