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

  const candlestickSeries = chart.addCandlestickSeries({
    baseLineVisible: false,
    borderVisible: false,
    priceLineVisible: false,
    baseLineColor: "",
    borderColor: "",
    borderDownColor: "",
    borderUpColor: "",
    ...options.seriesOptions,
  });

  const _upColor = inverseColors ? colors.loss : colors.profit;

  const _downColor = inverseColors ? colors.profit : colors.loss;

  createEffect(() => {
    const upColor = _upColor(dark);

    const downColor = _downColor(dark);

    candlestickSeries.applyOptions({
      upColor,
      wickUpColor: upColor,
      downColor,
      wickDownColor: downColor,
    });
  });

  return [candlestickSeries, [_upColor, _downColor]];
};
