import { chartState } from "./state";

export function cleanChart() {
  console.log("chart: clean");

  try {
    chartState.chart?.remove();
  } catch {}

  chartState.chart = null;
}
