import { dateToString, getNumberOfDaysBetweenTwoDates } from "../utils/date";
import { createLineSeries } from "./line";

export const GENESIS_DAY = "2009-01-03";

const whitespaceStartDate = new Date("1970-01-01");
const whitespaceStartDateYear = whitespaceStartDate.getUTCFullYear();
const whitespaceStartDateMonth = whitespaceStartDate.getUTCMonth();
const whitespaceStartDateDate = whitespaceStartDate.getUTCDate();
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
  const whitespace = chart.addLineSeries();

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

// ---

// import { HEIGHT_CHUNK_SIZE } from "../datasets";
// import { dateToString } from "../utils/date";

// export const GENESIS_DAY = "2009-01-03";

// function leapYear(year: number) {
//   return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
// }

// const whitespaceStartDate = new Date("1970-01-01");
// export const whitespaceStartDateYear = whitespaceStartDate.getFullYear();
// const whitespaceStartDateMonth = whitespaceStartDate.getMonth();
// const whitespaceStartDateDate = whitespaceStartDate.getDate();
// const whitespaceEndDate = new Date("2141-01-01");
// const whitespaceEndDateYear = whitespaceEndDate.getFullYear();

// export const whitespaceDateDatasets: (WhitespaceData | SingleValueData)[][] =
//   Array.from(
//     { length: whitespaceEndDateYear - whitespaceStartDateYear },
//     (_, i) => new Array(leapYear(whitespaceStartDateYear + i) ? 366 : 365),
//   );
// for (let i = 0; i < whitespaceDateDatasets.length; i++) {
//   const year = whitespaceStartDateYear + i;
//   const whitespaceDateDataset = whitespaceDateDatasets[i];

//   // Hack to be able to scroll freely
//   // Setting them all to NaN is much slower
//   for (let j = 0; j < whitespaceDateDataset.length; j++) {
//     const date = new Date(
//       year,
//       whitespaceStartDateMonth,
//       whitespaceStartDateDate + j,
//     );

//     const time = dateToString(date);

//     if (j === whitespaceDateDataset.length - 1) {
//       whitespaceDateDataset[j] = {
//         time,
//         value: NaN,
//       };
//     } else {
//       whitespaceDateDataset[j] = {
//         time,
//       };
//     }
//   }
// }

// export const whitespaceHeightStart = -50_000;
// export const whitespaceHeightDatasets: (WhitespaceData | SingleValueData)[][] =
//   Array.from(
//     { length: (new Date().getUTCFullYear() - 2009 + 1) * 6 },
//     () => new Array(HEIGHT_CHUNK_SIZE),
//   );

// for (let i = 0; i < whitespaceHeightDatasets.length; i++) {
//   const offset = HEIGHT_CHUNK_SIZE * i;
//   const whitespaceHeightDataset = whitespaceHeightDatasets[i];

//   for (let j = 0; j < whitespaceHeightDataset.length; j++) {
//     const height = whitespaceHeightStart + offset + j;

//     if (j === whitespaceHeightDataset.length - 1) {
//       whitespaceHeightDataset[j] = {
//         time: height as any,
//         value: NaN,
//       };
//     } else {
//       whitespaceHeightDataset[j] = {
//         time: height as any,
//       };
//     }
//   }
// }
