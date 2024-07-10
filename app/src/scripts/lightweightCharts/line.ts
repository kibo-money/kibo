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
  function computeColors() {
    return {
      color: color(dark),
    } as const;
  }

  const series = chart.addLineSeries({
    ...defaultSeriesOptions,
    ...options,
    ...computeColors(),
  });

  createEffect(() => {
    series.applyOptions(computeColors());
  });

  return series;
};
