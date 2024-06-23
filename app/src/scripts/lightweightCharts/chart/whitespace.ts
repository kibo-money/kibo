import { dateToString, getNumberOfDaysBetweenTwoDates } from "../../utils/date";
import { ONE_DAY_IN_MS } from "../../utils/time";
import { createLineSeries } from "../series/creators/line";

export const DAY_BEFORE_GENESIS_DAY = "2009-01-02";
export const GENESIS_DAY = "2009-01-03";
// export const DAY_BEFORE_WHITEPAPER_DAY = "2008-10-30";
// export const WHITEPAPER_DAY = "2008-10-31";

const whitespaceStartDate = "1970-01-01";
const whitespaceEndDate = "2100-01-01";
const whitespaceDateDataset: (SingleValueData & Numbered)[] = new Array(
  getNumberOfDaysBetweenTwoDates(
    new Date(whitespaceStartDate),
    new Date(whitespaceEndDate),
  ),
)
  .fill(0)
  .map((_, index) => {
    const date = new Date(whitespaceStartDate);
    date.setUTCDate(date.getUTCDay() + index);

    return {
      number: date.valueOf() / ONE_DAY_IN_MS,
      time: dateToString(date),
      value: NaN,
    };
  });

const whitespaceHeightDataset: (WhitespaceData & Numbered)[] = new Array(
  840_000,
)
  .fill(0)
  .map(
    (_, index) =>
      ({
        time: index,
        number: index,
      }) as any,
  );

export function setWhitespace(chart: IChartApi, scale: ResourceScale) {
  const whitespaceSeries = createLineSeries(chart);

  if (scale === "date") {
    whitespaceSeries.setData(whitespaceDateDataset);
  } else {
    whitespaceSeries.setData(whitespaceHeightDataset);
  }
}
