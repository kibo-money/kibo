import {
  createChart as createClassicChart,
  createChartEx as createCustomChart,
  CrosshairMode,
} from "lightweight-charts";

import { colors } from "../../utils/colors";
import { valueToString } from "../../utils/locale";
import { HorzScaleBehaviorHeight } from "./horzScaleBehavior";

export function createChart(
  scale: ResourceScale,
  element: HTMLElement,
  priceScaleOptions?: DeepPartialPriceScaleOptions,
) {
  console.log(`chart: create (scale: ${scale})`);

  const { white } = colors;

  const options: DeepPartialChartOptions = {
    autoSize: true,
    layout: {
      fontFamily: "Lexend",
      background: { color: "transparent" },
      fontSize: 14,
      textColor: white,
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { visible: false },
    },
    rightPriceScale: {
      borderColor: "#332F24",
    },
    timeScale: {
      borderColor: "#332F24",
      minBarSpacing: scale === "date" ? 0.05 : 0.005,
      shiftVisibleRangeOnNewBar: false,
      allowShiftVisibleRangeOnWhitespaceReplacement: false,
    },
    handleScale: {
      axisDoubleClickReset: {
        time: false,
      },
    },
    crosshair: {
      mode: CrosshairMode.Normal,
      horzLine: {
        color: white,
        labelBackgroundColor: white,
      },
      vertLine: {
        color: white,
        labelBackgroundColor: white,
      },
    },
    localization: {
      priceFormatter: valueToString,
      locale: "en-us",
    },
  };

  let chart: IChartApi;

  if (scale === "date") {
    chart = createClassicChart(element, options);
  } else {
    const horzScaleBehavior = new HorzScaleBehaviorHeight();

    // @ts-ignore
    chart = createCustomChart(element, horzScaleBehavior, options);
  }

  chart.priceScale("right").applyOptions({
    ...priceScaleOptions,
    scaleMargins: {
      top: 0.05,
      bottom: 0.05,
      ...priceScaleOptions?.scaleMargins,
    },
    minimumWidth: 78,
  });

  return chart;
}
