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
          datasetPath: `/date-to-price-${average.key}-sma`,
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
                color: colors.red,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-1y-sma`,
              },
              {
                title: `1M`,
                color: colors.orange,
                datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio-1m-sma`,
              },
              {
                title: `1W`,
                color: colors.yellow,
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
        ],
      },
    ],
  } satisfies PartialPresetFolder;
}
