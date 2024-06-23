import { averages } from "/src/scripts/datasets/date";
import { colors } from "/src/scripts/utils/colors";

import { applyMultipleSeries } from "../../templates/multiple";

export function createPresets(datasets: Datasets): PartialPresetFolder {
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
          return applyMultipleSeries({
            ...params,
            list: averages.map((average) => ({
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
          datasets,
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
  datasets,
  color,
  name,
  key,
}: {
  datasets: Datasets;
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
      return applyMultipleSeries({
        ...params,
        list: [
          {
            title: `SMA`,
            color,
            dataset: datasets.date[`price_${key}_sma`],
          },
        ],
      });
    },
  } satisfies PartialPreset;
}
