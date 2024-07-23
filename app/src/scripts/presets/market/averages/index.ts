import { averages } from "/src/scripts/datasets/date";
import { colors } from "/src/scripts/utils/colors";

import { createRatioFolder } from "../../templates/ratio";

export function createPresets(scale: ResourceScale): PartialPresetFolder {
  return {
    name: "Averages",
    tree: [
      {
        scale,
        icon: IconTablerMathAvg,
        name: "All",
        title: "All Moving Averages",
        description: "",
        unit: "US Dollars",
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
          title: `${name} Market Price Moving Average`,
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
  title,
  key,
}: {
  scale: ResourceScale;
  color: Color;
  name: string;
  title: string;
  key: AverageName;
}) {
  return {
    name,
    tree: [
      {
        scale,
        name: "Average",
        title,
        description: "",
        unit: "US Dollars",
        icon: IconTablerMathAvg,
        top: [
          {
            title: `SMA`,
            color,
            datasetPath: `/${scale}-to-price-${key}-sma`,
          },
        ],
      },
      createRatioFolder({
        scale,
        color,
        ratioDatasetPath: `/${scale}-to-market-price-to-price-${key}-sma-ratio`,
        valueDatasetPath: `/${scale}-to-price-${key}-sma`,
        title,
      }),
    ],
  } satisfies PartialPresetFolder;
}
