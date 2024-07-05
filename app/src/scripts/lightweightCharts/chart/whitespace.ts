import { dateToString, getNumberOfDaysBetweenTwoDates } from "../../utils/date";
import { createLineSeries } from "../series/creators/line";

export const GENESIS_DAY = "2009-01-03";

const whitespaceStartDate = new Date("1970-01-01");
const whitespaceStartDateYear = whitespaceStartDate.getFullYear();
const whitespaceStartDateMonth = whitespaceStartDate.getMonth();
const whitespaceStartDateDate = whitespaceStartDate.getDate();
const whitespaceEndDate = new Date("2141-01-01");
const whitespaceDateDataset: (WhitespaceData | SingleValueData)[] = new Array(
  getNumberOfDaysBetweenTwoDates(whitespaceStartDate, whitespaceEndDate),
);
// Hack to be able to scroll freely
// Setting them all to NaN is much slower
for (let i = 0; i < whitespaceDateDataset.length; i++) {
  const date = new Date(
    whitespaceStartDateYear,
    whitespaceStartDateMonth,
    whitespaceStartDateDate + i,
  );

  const time = dateToString(date);

  if (i === whitespaceDateDataset.length - 1) {
    whitespaceDateDataset[i] = {
      time,
      value: NaN,
    };
  } else {
    whitespaceDateDataset[i] = {
      time,
    };
  }
}

const heightStart = -50_000;
const whitespaceHeightDataset: WhitespaceData[] = new Array(
  (new Date().getUTCFullYear() - 2009 + 1) * 60_000,
);
for (let i = 0; i < whitespaceHeightDataset.length; i++) {
  const height = heightStart + i;

  whitespaceHeightDataset[i] = {
    time: height as any,
  };
}

export function setWhitespace(chart: IChartApi, scale: ResourceScale) {
  const whitespace = createLineSeries(chart);

  if (scale === "date") {
    whitespace.setData(whitespaceDateDataset);
  } else {
    whitespace.setData(whitespaceHeightDataset);

    const time = whitespaceHeightDataset.length;
    whitespace.update({
      time: time as Time,
      value: NaN,
    });
  }

  return whitespace;
}
