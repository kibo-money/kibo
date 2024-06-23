// import { ONE_DAY_IN_MS } from "./time";

import { ONE_DAY_IN_MS } from "./time";

export const dateToString = (date: Date) => date.toJSON().split("T")[0];

// export const FIVE_MONTHS_IN_DAYS = 30 * 5;

export const getNumberOfDaysBetweenTwoDates = (oldest: Date, youngest: Date) =>
  Math.round(Math.abs((youngest.valueOf() - oldest.valueOf()) / ONE_DAY_IN_MS));
