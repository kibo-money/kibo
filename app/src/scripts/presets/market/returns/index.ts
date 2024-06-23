import {
  compoundReturns,
  totalReturns,
} from "/src/scripts/datasets/consts/returns";

import { applyMultipleSeries, SeriesType } from "../../templates/multiple";

export function createPresets(datasets: Datasets) {
  return {
    name: "Returns",
    tree: [
      {
        name: "Total",
        tree: [
          ...totalReturns.map(({ name, key }) =>
            createPreset({
              scale: "date",
              datasets,
              name,
              title: `${name} Total`,
              key: `${key}_total`,
            }),
          ),
        ],
      },
      {
        name: "Compound",
        tree: [
          ...compoundReturns.map(({ name, key }) =>
            createPreset({
              scale: "date",
              datasets,
              name,
              title: `${name} Compound`,
              key: `${key}_compound`,
            }),
          ),
        ],
      },
    ],
  } satisfies PartialPresetFolder;
}

function createPreset({
  scale,
  datasets,
  name,
  title,
  key,
}: {
  scale: ResourceScale;
  datasets: Datasets;
  name: string;
  title: string;
  key: `${TotalReturnKey}_total` | `${CompoundReturnKey}_compound`;
}): PartialPreset {
  return {
    scale,
    name,
    description: "",
    icon: IconTablerReceiptTax,
    title: `${title} Return`,
    applyPreset(params) {
      return applyMultipleSeries({
        ...params,
        priceScaleOptions: {
          halved: true,
        },
        list: [
          {
            title: `Return (%)`,
            seriesType: SeriesType.Based,
            dataset: datasets.date[`price_${key}_return`],
          },
        ],
      });
    },
  };
}
