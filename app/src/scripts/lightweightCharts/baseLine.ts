import { colors } from "/src/scripts/utils/colors";

import { defaultSeriesOptions } from "./options";

const DEFAULT_BASELINE_TOP_COLOR = colors.profit;
const DEFAULT_BASELINE_BOTTOM_COLOR = colors.loss;

export const DEFAULT_BASELINE_COLORS = [
  DEFAULT_BASELINE_TOP_COLOR,
  DEFAULT_BASELINE_BOTTOM_COLOR,
];

const transparent = `transparent`;

export const createBaseLineSeries = ({
  chart,
  dark,
  color,
  topColor,
  bottomColor,
  options,
}: {
  chart: IChartApi;
  dark: Accessor<boolean>;
  color?: Color;
  topColor?: Color;
  bottomColor?: Color;
  options?: DeepPartialBaselineOptions & {
    base?: number;
  };
}) => {
  const topLineColor = topColor || color || DEFAULT_BASELINE_TOP_COLOR;

  const bottomLineColor = bottomColor || color || DEFAULT_BASELINE_BOTTOM_COLOR;

  function computeColors() {
    return {
      topLineColor: topLineColor(dark),
      bottomLineColor: bottomLineColor(dark),
    } as const;
  }

  const seriesOptions: DeepPartialBaselineOptions = {
    priceScaleId: "right",
    ...defaultSeriesOptions,
    // lineWidth: 1,
    ...options,
    ...(options?.base
      ? { baseValue: { type: "price", price: options?.base } }
      : {}),
    topFillColor1: transparent,
    topFillColor2: transparent,
    bottomFillColor1: transparent,
    bottomFillColor2: transparent,
    ...computeColors(),
  };

  const series = chart.addBaselineSeries(seriesOptions);

  createEffect(() => {
    series.applyOptions(computeColors());
  });

  return series;
};
