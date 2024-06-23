import { PRICE_SCALE_MOMENTUM_ID } from "../../chart/price";
import { defaultSeriesOptions } from "./options";

type HistogramOptions = DeepPartial<
  HistogramStyleOptions & SeriesOptionsCommon
>;

export const createHistogramSeries = (
  chart: IChartApi,
  options?: HistogramOptions,
) => {
  const seriesOptions: HistogramOptions = {
    priceScaleId: "left",
    ...defaultSeriesOptions,
    ...options,
  };

  const series = chart.addHistogramSeries(seriesOptions);

  try {
    chart.priceScale(PRICE_SCALE_MOMENTUM_ID).applyOptions({
      scaleMargins: {
        top: 0.9,
        bottom: 0,
      },
    });
  } catch {}

  return series;
};
