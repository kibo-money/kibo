import { defaultSeriesOptions } from "./options";

export const createLineSeries = ({
  chart,
  dark,
  color,
  options,
}: {
  chart: IChartApi;
  dark: Accessor<boolean>;
  color: Color;
  options?: DeepPartialLineOptions;
}) => {
  const series = chart.addLineSeries({
    ...defaultSeriesOptions,
    ...options,
  });

  createEffect(() => {
    series.applyOptions({
      color: color(dark),
    });
  });

  return series;
};
