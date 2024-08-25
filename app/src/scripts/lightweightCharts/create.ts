import {
  createChart as createClassicChart,
  createChartEx as createCustomChart,
  CrosshairMode,
} from "lightweight-charts";

import { colors } from "../utils/colors";
import { valueToString } from "../utils/locale";
import { HorzScaleBehaviorHeight } from "./horzScaleBehavior";

export function createChart({
  scale,
  element,
  dark,
}: {
  scale: ResourceScale;
  element: HTMLElement;
  dark: Accessor<boolean>;
}) {
  console.log(`chart: create (scale: ${scale})`);

  const options: DeepPartialChartOptions = {
    autoSize: true,
    layout: {
      fontFamily: "Satoshi Chart",
      background: { color: "transparent" },
      attributionLogo: false,
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { visible: false },
    },
    timeScale: {
      minBarSpacing: 0.05,
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
    scaleMargins: {
      top: 0.075,
      bottom: 0.05,
    },
    minimumWidth: 78,
  });

  createEffect(() => {
    const { white } = colors;

    const color = white(dark);
    // const borderColor = dark() ? "#332F24" : "#F1E4E0";

    chart.applyOptions({
      layout: {
        textColor: "#666666",
      },
      rightPriceScale: {
        borderVisible: false,
        // borderColor,
      },
      timeScale: {
        borderVisible: false,
        // borderColor,
      },
      crosshair: {
        horzLine: {
          color: color,
          labelBackgroundColor: color,
        },
        vertLine: {
          color: color,
          labelBackgroundColor: color,
        },
      },
    });
  });

  return chart;
}
