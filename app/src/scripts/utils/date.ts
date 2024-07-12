import { ONE_DAY_IN_MS } from "./time";

export const dateToString = (date: Date) => date.toJSON().split("T")[0];

export const getNumberOfDaysBetweenTwoDates = (oldest: Date, youngest: Date) =>
  Math.round(Math.abs((youngest.getTime() - oldest.getTime()) / ONE_DAY_IN_MS));

export function dateFromTime(time: Time) {
  return typeof time === "string"
    ? new Date(time)
    : // @ts-ignore
      new Date(time.year, time.month, time.day);
}
