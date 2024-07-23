import { dateFromTime, getNumberOfDaysBetweenTwoDates } from "../utils/date";
import { debounce } from "../utils/debounce";

export const debouncedUpdateVisiblePriceSeriesType = debounce(
  updateVisiblePriceSeriesType,
  50,
);

export function updateVisiblePriceSeriesType({
  scale,
  chart,
  logicalRange,
  timeRange,
  priceSeriesType,
}: {
  scale: ResourceScale;
  chart: IChartApi;
  logicalRange?: LogicalRange;
  timeRange?: TimeRange;
  priceSeriesType: RWS<PriceSeriesType>;
}) {
  try {
    const width = chart.timeScale().width();

    let ratio: number;

    if (logicalRange) {
      ratio = (logicalRange.to - logicalRange.from) / width;
    } else if (timeRange) {
      if (scale === "date") {
        ratio = getNumberOfDaysBetweenTwoDates(
          dateFromTime(timeRange.from),
          dateFromTime(timeRange.to),
        );
      } else {
        ratio = ((timeRange.to as number) - (timeRange.from as number)) / width;
      }
    } else {
      throw Error();
    }

    if (ratio <= 0.5) {
      priceSeriesType.set("Candlestick");
    } else {
      priceSeriesType.set("Line");
    }
  } catch {}
}
