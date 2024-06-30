import { colors } from "/src/scripts/utils/colors";

export const createCandlesticksSeries = (
  chart: IChartApi,
  options: PriceSeriesOptions = {},
): [ISeriesApi<"Candlestick">, string[]] => {
  const { inverseColors } = options;

  const upColor = inverseColors ? colors.loss : colors.profit;

  const downColor = inverseColors ? colors.profit : colors.loss;

  const candlestickSeries = chart.addCandlestickSeries({
    baseLineVisible: false,
    upColor,
    wickUpColor: upColor,
    downColor,
    wickDownColor: downColor,
    borderVisible: false,
    priceLineVisible: false,
    baseLineColor: "",
    borderColor: "",
    borderDownColor: "",
    borderUpColor: "",
    ...options.seriesOptions,
  });

  return [candlestickSeries, [upColor, downColor]];
};
