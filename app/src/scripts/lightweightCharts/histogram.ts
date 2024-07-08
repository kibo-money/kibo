import { defaultSeriesOptions } from "./options";

type HistogramOptions = DeepPartial<
  HistogramStyleOptions & SeriesOptionsCommon
>;

export const PRICE_SCALE_MOMENTUM_ID = "momentum";

export const createHistogramSeries = ({
  chart,
  // dark,
  // color,
  options,
}: {
  chart: IChartApi;
  // dark: Accessor<boolean>;
  // color: Color;
  options?: HistogramOptions;
}) => {
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
