import { averages } from "/src/scripts/datasets/date";
import { colors } from "/src/scripts/utils/colors";

export function createPresets(): PartialPresetFolder {
  const scale: ResourceScale = "date";

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
            datasetPath: `/date-to-price-${key}-sma`,
          },
        ],
      },
      {
        scale,
        name: "Ratio",
        description: "",
        icon: IconTablerMathXDivideY,
        title: `${name} Moving Average Ratio`,
        top: [
          {
            title: `SMA`,
            color,
            datasetPath: `/date-to-price-${key}-sma`,
          },
        ],
        bottom: [
          {
            title: `Ratio`,
            color,
            datasetPath: `/date-to-market-price-to-price-${key}-sma-ratio`,
          },
        ],
      },
    ],
  } satisfies PartialPresetFolder;
}
