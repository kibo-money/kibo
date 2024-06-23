import { defaultSeriesOptions } from "./options";

export const createLineSeries = (
  chart: IChartApi,
  options?: DeepPartialLineOptions,
) =>
  chart.addLineSeries({
    ...defaultSeriesOptions,
    ...options,
  });
