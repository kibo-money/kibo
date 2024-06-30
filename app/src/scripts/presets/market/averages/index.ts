import { averages } from "/src/scripts/datasets/date";
import { colors } from "/src/scripts/utils/colors";

import { applySeriesList } from "../../apply";

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
        applyPreset(params) {
          return applySeriesList({
            ...params,
            top: averages.map((average) => ({
              title: average.key.toUpperCase(),
              color: colors[`_${average.key}`],
              dataset: params.datasets.date[`price_${average.key}_sma`],
            })),
          });
        },
        description: "",
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
  color: string;
  name: string;
  key: AverageName;
}) {
  return {
    // id,
    // name,
    // tree: [
    //   {
    scale,
    name,
    description: "",
    icon: IconTablerMathAvg,
    title: `${name} Moving Average`,
    applyPreset(params) {
      return applySeriesList({
        ...params,
        top: [
          {
            title: `SMA`,
            color,
            dataset: params.datasets.date[`price_${key}_sma`],
          },
        ],
      });
    },
  } satisfies PartialPreset;
}
