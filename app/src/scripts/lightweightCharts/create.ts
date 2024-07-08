import {
  createChart as createClassicChart,
  createChartEx as createCustomChart,
  CrosshairMode,
} from "lightweight-charts";

import { colors } from "../utils/colors";
import { valueToString } from "../utils/locale";
import { HorzScaleBehaviorHeight } from "./horzScaleBehavior";

export function createChart(
  scale: ResourceScale,
  element: HTMLElement,
  {
    dark,
    priceScaleOptions,
  }: {
    dark: Accessor<boolean>;
    priceScaleOptions: DeepPartialPriceScaleOptions;
  },
) {
  console.log(`chart: create (scale: ${scale})`);

  const options: DeepPartialChartOptions = {
    autoSize: true,
    layout: {
      fontFamily: "Lexend",
      background: { color: "transparent" },
      fontSize: 14,
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
    ...priceScaleOptions,
    scaleMargins: {
      top: 0.05,
      bottom: 0.05,
      ...priceScaleOptions?.scaleMargins,
    },
    minimumWidth: 78,
  });

  createEffect(() => {
    const { white } = colors;

    const textColor = white(dark);
    const borderColor = dark() ? "#332F24" : "#F1E4E0";

    chart.applyOptions({
      layout: {
        textColor,
      },
      rightPriceScale: {
        borderColor,
      },
      timeScale: {
        borderColor,
      },
      crosshair: {
        horzLine: {
          color: textColor,
          labelBackgroundColor: textColor,
        },
        vertLine: {
          color: textColor,
          labelBackgroundColor: textColor,
        },
      },
    });
  });

  return chart;
}
