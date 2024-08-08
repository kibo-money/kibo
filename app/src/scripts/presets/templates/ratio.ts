import { colors } from "../../utils/colors";
import { SeriesType } from "../enums";

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
        icon: IconTablerMathXDivideY,
        title: `Market Price To ${title} Ratio`,
        unit: "Ratio",
        description: "",
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
            datasetPath: `${scale}-to-1`,
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
        unit: "Ratio",
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
            datasetPath: `${ratioDatasetPath}-1y-sma` as any,
          },
          {
            title: `1M`,
            color: colors._1m,
            datasetPath: `${ratioDatasetPath}-1m-sma` as any,
          },
          {
            title: `1W`,
            color: colors._1w,
            datasetPath: `${ratioDatasetPath}-1w-sma` as any,
          },
          {
            title: `Raw`,
            color: colors.white,
            datasetPath: ratioDatasetPath as any,
          },
          {
            title: `Even`,
            color: colors.gray,
            datasetPath: `${scale}-to-1`,
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
        title: `Market Price To ${title} Ratio 1Y SMA Momentum Oscillator`,
        description: "",
        unit: "Ratio",
        icon: IconTablerWaveSine,
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
            datasetPath:
              `${ratioDatasetPath}-1y-sma-momentum-oscillator` as any,
          },
          {
            title: `Base`,
            color: colors.white,
            datasetPath: `${scale}-to-0`,
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
        icon: IconTablerJetpack,
        title: `Market Price To ${title} Ratio Top Percentiles`,
        description: "",
        unit: "Ratio",
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
            color: colors.probability0_1p,
            datasetPath: `${ratioDatasetPath}-99-9p` as any,
          },
          {
            title: `99.5%`,
            color: colors.probability0_5p,
            datasetPath: `${ratioDatasetPath}-99-5p` as any,
          },
          {
            title: `99%`,
            color: colors.probability1p,
            datasetPath: `${ratioDatasetPath}-99p` as any,
          },
          {
            title: `Raw`,
            color: colors.white,
            datasetPath: ratioDatasetPath,
          },
        ],
      },
      {
        scale,
        name: "Bottom Percentiles",
        icon: IconTablerScubaMask,
        title: `Market Price To ${title} Ratio Bottom Percentiles`,
        description: "",
        unit: "Ratio",
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
            color: colors.probability1p,
            datasetPath: `${ratioDatasetPath}-1p` as any,
          },
          {
            title: `0.5%`,
            color: colors.probability0_5p,
            datasetPath: `${ratioDatasetPath}-0-5p` as any,
          },
          {
            title: `0.1%`,
            color: colors.probability0_1p,
            datasetPath: `${ratioDatasetPath}-0-1p` as any,
          },
          {
            title: `Raw`,
            color: colors.white,
            datasetPath: ratioDatasetPath,
          },
        ],
      },
      {
        scale,
        name: "Top Probabilities",
        icon: IconTablerRocket,
        title: `${title} Top Probabilities`,
        description: "",
        unit: "US Dollars",
        top: [
          {
            title: `0.1%`,
            color: colors.probability0_1p,
            datasetPath: `${valueDatasetPath}-99-9p` as any,
          },
          {
            title: `0.5%`,
            color: colors.probability0_5p,
            datasetPath: `${valueDatasetPath}-99-5p` as any,
          },
          {
            title: `1%`,
            color: colors.probability1p,
            datasetPath: `${valueDatasetPath}-99p` as any,
          },
        ],
      },
      {
        scale,
        name: "Bottom Probabilities",
        icon: IconTablerSubmarine,
        title: `${title} Bottom Probabilities`,
        description: "",
        unit: "US Dollars",
        top: [
          {
            title: `0.1%`,
            color: colors.probability0_1p,
            datasetPath: `${valueDatasetPath}-0-1p` as any,
          },
          {
            title: `0.5%`,
            color: colors.probability0_5p,
            datasetPath: `${valueDatasetPath}-0-5p` as any,
          },
          {
            title: `1%`,
            color: colors.probability1p,
            datasetPath: `${valueDatasetPath}-1p` as any,
          },
        ],
      },
    ],
  };
}
