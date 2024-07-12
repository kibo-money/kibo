import { averages } from "/src/scripts/datasets/date";
import { colors } from "/src/scripts/utils/colors";

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
        scale,
        name: "Ratio",
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
            color,
            datasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio`,
          },
          {
            title: `Even`,
            color: colors.white,
            datasetPath: `/${scale}-to-1`,
          },
        ],
      },
    ],
  } satisfies PartialPresetFolder;
}
