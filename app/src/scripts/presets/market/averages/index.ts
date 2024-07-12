import { averages } from "/src/scripts/datasets/date";
import { colors } from "/src/scripts/utils/colors";

import { SeriesType } from "../../enums";

export function createPresets(scale: ResourceScale): PartialPresetFolder {
  return {
    name: "Averages",
    tree: [
      {
        scale,
        icon: IconTablerMathAvg,
        name: "All",
        title: "All Averages",
        description: "",
        top: averages.map((average) => ({
          title: average.key.toUpperCase(),
          color: colors[`_${average.key}`],
          datasetPath: `/${scale}-to-price-${average.key}-sma`,
        })),
      },
      ...averages.map(({ name, key }) =>
        createPresetFolder({
          scale,
          color: colors[`_${key}`],
          name,
          key,
        }),
      ),
    ],
  };
}

function createPresetFolder({
  scale,
  color,
  name,
  key,
}: {
  scale: ResourceScale;
  color: Color;
  name: string;
  key: AverageName;
}) {
  return {
    name,
    tree: [
      {
        scale,
        name: "Average",
        description: "",
        icon: IconTablerMathAvg,
        title: `${name} Moving Average`,
        top: [
          {
            title: `SMA`,
            color,
            datasetPath: `/${scale}-to-price-${key}-sma`,
          },
        ],
      },
      {
        name: "Ratio",
        tree: [
          {
            scale,
            name: "Basic",
            description: "",
            icon: IconTablerMathXDivideY,
            title: `Market Price To ${name} Moving Average Ratio`,
            top: [
              {
                title: `SMA`,
                color,
                datasetPath: `/${scale}-to-price-${key}-sma`,
              },
            ],
            bottom: [
              {
                title: `Ratio`,
                seriesType: SeriesType.Based,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio`,
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
            title: `Market Price To ${name} Moving Average Ratio Averages`,
            top: [
              {
                title: `SMA`,
                color,
                datasetPath: `/${scale}-to-price-${key}-sma`,
              },
            ],
            bottom: [
              {
                title: `1Y`,
                color: colors._1y,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-1y-sma`,
              },
              {
                title: `1M`,
                color: colors._1m,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-1m-sma`,
              },
              {
                title: `1W`,
                color: colors._1w,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-1w-sma`,
              },
              {
                title: `Raw`,
                color: colors.white,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio`,
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
            title: `Market Price To ${name} Moving Average Ratio 1Y SMA Momentum Oscillator`,
            top: [
              {
                title: `SMA`,
                color,
                datasetPath: `/${scale}-to-price-${key}-sma`,
              },
            ],
            bottom: [
              {
                title: `Momentum`,
                seriesType: SeriesType.Based,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-1y-sma-momentum-oscillator`,
              },
              // {
              //   title: `Raw`,
              //   color: colors.white,
              //   datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio`,
              //   options: {
              //     base: 1,
              //   },
              // },
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
            name: "Percentiles",
            description: "",
            icon: IconTablerPercentage,
            title: `Market Price To ${name} Moving Average Ratio Percentiles`,
            top: [
              {
                title: `SMA`,
                color,
                datasetPath: `/${scale}-to-price-${key}-sma`,
              },
            ],
            bottom: [
              {
                title: `99.9%`,
                color: colors.extremeMax,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-99-9p`,
              },
              {
                title: `99.5%`,
                color: colors.extremeMiddle,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-99-5p`,
              },
              {
                title: `99%`,
                color: colors.extremeMin,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-99p`,
              },
              {
                title: `1%`,
                color: colors.extremeMin,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-1p`,
              },

              {
                title: `0.5%`,
                color: colors.extremeMiddle,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-0-5p`,
              },
              {
                title: `0.1%`,
                color: colors.extremeMax,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-0-1p`,
              },
              {
                title: `Raw`,
                color: colors.white,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio`,
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
            name: "Extreme Tops",
            description: "",
            icon: IconTablerRocket,
            title: `${name} Moving Average Extreme Tops`,
            top: [
              {
                title: `99.9%`,
                color: colors.extremeMax,
                datasetPath: `/${scale}-to-price-${key}-sma-99-9p`,
              },
              {
                title: `99.5%`,
                color: colors.extremeMiddle,
                datasetPath: `/${scale}-to-price-${key}-sma-99-5p`,
              },
              {
                title: `99%`,
                color: colors.extremeMin,
                datasetPath: `/${scale}-to-price-${key}-sma-99p`,
              },
            ],
          },
        ],
      },
    ],
  } satisfies PartialPresetFolder;
}
