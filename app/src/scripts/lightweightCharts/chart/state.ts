import { getInitialRange } from "./time";

export const LOCAL_STORAGE_RANGE_KEY = "chart-range";
export const URL_PARAMS_RANGE_FROM_KEY = "from";
export const URL_PARAMS_RANGE_TO_KEY = "to";

export const chartState = {
  chart: null as IChartApi | null,
  range: getInitialRange(),
};
