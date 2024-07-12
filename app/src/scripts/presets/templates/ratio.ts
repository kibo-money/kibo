// import {
//   applyMultipleSeries,
//   colors,
//   createMomentumPresetFolder,
//   SeriesType,
// } from "/src/scripts";

import { colors } from "../../utils/colors";
import { SeriesType } from "../enums";

// // type HeightRatioKey =
// //   | `${AnyPossibleCohortKey}RealizedPrice`
// //   | "activePrice"
// //   | "vaultedPrice"
// //   | "trueMarketMean";

// // // type DateRatioKey = HeightRatioKey;
// // type DateRatioKey = HeightRatioKey | `price${AverageName}MA`;

export function createRatioFolder({
  scale,
  color,
  valueDatasetPath,
  ratioDatasetPath,
  title,
}: {
  scale: ResourceScale;
  color: Color;
  valueDatasetPath: AnyDatasetPath;
  ratioDatasetPath: AnyDatasetPath;
  title: string;
}): PartialPresetFolder {
  return {
    name: "Ratio",
    tree: [
      {
        scale,
        name: "Basic",
        description: "",
        icon: IconTablerMathXDivideY,
        title: `Market Price To ${title} Ratio`,
        top: [
          {
            title: `SMA`,
            color,
            datasetPath: valueDatasetPath,
          },
        ],
        bottom: [
          {
            title: `Ratio`,
            seriesType: SeriesType.Based,
            datasetPath: ratioDatasetPath,
            options: {
              base: 1,
            },
          },
          {
            title: `Even`,
            color: colors.white,
            datasetPath: `/${scale}-to-1`,
            options: {
              lineStyle: 3,
              lastValueVisible: false,
            },
          },
        ],
      },
      {
        scale,
        name: "Averages",
        description: "",
        icon: IconTablerMathAvg,
        title: `Market Price To ${title} Ratio Averages`,
        top: [
          {
            title: `SMA`,
            color,
            datasetPath: valueDatasetPath,
          },
        ],
        bottom: [
          {
            title: `1Y`,
            color: colors._1y,
            datasetPath: `${ratioDatasetPath}-1y-sma`,
          },
          {
            title: `1M`,
            color: colors._1m,
            datasetPath: `${ratioDatasetPath}-1m-sma`,
          },
          {
            title: `1W`,
            color: colors._1w,
            datasetPath: `${ratioDatasetPath}-1w-sma`,
          },
          {
            title: `Raw`,
            color: colors.white,
            datasetPath: ratioDatasetPath,
            options: {
              base: 1,
            },
          },
          {
            title: `Even`,
            color: colors.gray,
            datasetPath: `/${scale}-to-1`,
            options: {
              lineStyle: 3,
              lastValueVisible: false,
            },
          },
        ],
      },
      {
        scale,
        name: "Momentum Oscillator",
        description: "",
        icon: IconTablerWaveSine,
        title: `Market Price To ${title} Ratio 1Y SMA Momentum Oscillator`,
        top: [
          {
            title: `SMA`,
            color,
            datasetPath: valueDatasetPath,
          },
        ],
        bottom: [
          {
            title: `Momentum`,
            seriesType: SeriesType.Based,
            datasetPath: `${ratioDatasetPath}-1y-sma-momentum-oscillator`,
          },
          {
            title: `Base`,
            color: colors.white,
            datasetPath: `/${scale}-to-0`,
            options: {
              lineStyle: 3,
              lastValueVisible: false,
            },
          },
        ],
      },
      {
        scale,
        name: "Top Percentiles",
        description: "",
        icon: IconTablerJetpack,
        title: `Market Price To ${title} Ratio Top Percentiles`,
        top: [
          {
            title: `SMA`,
            color,
            datasetPath: valueDatasetPath,
          },
        ],
        bottom: [
          {
            title: `99.9%`,
            color: colors.extremeMax,
            datasetPath: `${ratioDatasetPath}-99-9p`,
          },
          {
            title: `99.5%`,
            color: colors.extremeMiddle,
            datasetPath: `${ratioDatasetPath}-99-5p`,
          },
          {
            title: `99%`,
            color: colors.extremeMin,
            datasetPath: `${ratioDatasetPath}-99p`,
          },
          {
            title: `Raw`,
            color: colors.white,
            datasetPath: ratioDatasetPath,
            options: {
              base: 1,
            },
          },
        ],
      },
      {
        scale,
        name: "Bottom Percentiles",
        description: "",
        icon: IconTablerScubaMask,
        title: `Market Price To ${title} Ratio Bottom Percentiles`,
        top: [
          {
            title: `SMA`,
            color,
            datasetPath: valueDatasetPath,
          },
        ],
        bottom: [
          {
            title: `1%`,
            color: colors.extremeMin,
            datasetPath: `${ratioDatasetPath}-1p`,
          },
          {
            title: `0.5%`,
            color: colors.extremeMiddle,
            datasetPath: `${ratioDatasetPath}-0-5p`,
          },
          {
            title: `0.1%`,
            color: colors.extremeMax,
            datasetPath: `${ratioDatasetPath}-0-1p`,
          },
          {
            title: `Raw`,
            color: colors.white,
            datasetPath: ratioDatasetPath,
            options: {
              base: 1,
            },
          },
        ],
      },
      {
        scale,
        name: "Extreme Tops",
        description: "",
        icon: IconTablerRocket,
        title: `${title} Extreme Tops`,
        top: [
          {
            title: `99.9%`,
            color: colors.extremeMax,
            datasetPath: `${valueDatasetPath}-99-9p`,
          },
          {
            title: `99.5%`,
            color: colors.extremeMiddle,
            datasetPath: `${valueDatasetPath}-99-5p`,
          },
          {
            title: `99%`,
            color: colors.extremeMin,
            datasetPath: `${valueDatasetPath}-99p`,
          },
        ],
      },
      {
        scale,
        name: "Extreme Bottoms",
        description: "",
        icon: IconTablerSubmarine,
        title: `${title} Extreme Bottoms`,
        top: [
          {
            title: `0.1%`,
            color: colors.extremeMax,
            datasetPath: `${valueDatasetPath}-0-1p`,
          },
          {
            title: `0.5%`,
            color: colors.extremeMiddle,
            datasetPath: `${valueDatasetPath}-0-5p`,
          },
          {
            title: `1%`,
            color: colors.extremeMin,
            datasetPath: `${valueDatasetPath}-1p`,
          },
        ],
      },
    ],
  };
}
