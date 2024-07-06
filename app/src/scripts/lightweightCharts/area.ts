import { defaultSeriesOptions } from "./options";

type AreaOptions = DeepPartial<AreaStyleOptions & SeriesOptionsCommon>;

export const createAreaSeries = (
  chart: IChartApi,
  options?: AreaOptions & {
    color?: string;
  },
) => {
  const { color } = options || {};

  // const fillColor = `${color}11`;
  const fillColor = color;

  const seriesOptions: AreaOptions = {
    // priceScaleId: 'left',
    ...defaultSeriesOptions,
    lineColor: color,
    topColor: fillColor,
    bottomColor: fillColor,
    ...options,
  };

  const series = chart.addAreaSeries(seriesOptions);

  return series;
};
