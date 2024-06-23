import {
  createChart as createClassicChart,
  createChartEx as createCustomChart,
  CrosshairMode,
} from "lightweight-charts";

import { colors } from "../../utils/colors";
import { priceToUSLocale } from "../../utils/locale";
import { cleanChart } from "./clean";
import { HorzScaleBehaviorHeight } from "./horzScaleBehavior";
import { chartState } from "./state";

export function createChart(scale: ResourceScale) {
  cleanChart();

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
    leftPriceScale: {
      // borderColor: white,
    },
    rightPriceScale: {
      // borderColor: white,
    },
    timeScale: {
      minBarSpacing: scale === "date" ? 0.05 : 0.005,
      shiftVisibleRangeOnNewBar: false,
      allowShiftVisibleRangeOnWhitespaceReplacement: false,
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
      priceFormatter: priceToUSLocale,
      locale: "en-us",
    },
  };

  if (scale === "date") {
    chartState.chart = createClassicChart("chart", options);
  } else {
    const horzScaleBehavior = new HorzScaleBehaviorHeight();

    // @ts-ignore
    chartState.chart = createCustomChart("chart", horzScaleBehavior, options);
  }
}
