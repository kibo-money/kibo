import { colors } from "/src/scripts/utils/colors";

export const createCandlesticksSeries = ({
  chart,
  dark,
  options = {},
}: {
  chart: IChartApi;
  dark: Accessor<boolean>;
  options?: PriceSeriesOptions;
}): [ISeriesApi<"Candlestick">, Color[]] => {
  const { inverseColors } = options;

  const _upColor = inverseColors ? colors.loss : colors.profit;

  const _downColor = inverseColors ? colors.profit : colors.loss;

  function computeColors() {
    const upColor = _upColor(dark);

    const downColor = _downColor(dark);

    return {
      upColor,
      wickUpColor: upColor,
      downColor,
      wickDownColor: downColor,
    } as const;
  }
  const candlestickSeries = chart.addCandlestickSeries({
    baseLineVisible: false,
    borderVisible: false,
    priceLineVisible: false,
    baseLineColor: "",
    borderColor: "",
    borderDownColor: "",
    borderUpColor: "",
    ...options.seriesOptions,
    ...computeColors(),
  });

  createEffect(() => {
    candlestickSeries.applyOptions(computeColors());
  });

  return [candlestickSeries, [_upColor, _downColor]];
};
