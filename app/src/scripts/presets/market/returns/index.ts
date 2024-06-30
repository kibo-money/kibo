import {
  compoundReturns,
  totalReturns,
} from "/src/scripts/datasets/consts/returns";

import { applySeriesList, SeriesType } from "../../apply";

export function createPresets() {
  return {
    name: "Returns",
    tree: [
      {
        name: "Total",
        tree: [
          ...totalReturns.map(({ name, key }) =>
            createPreset({
              scale: "date",
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
  name,
  title,
  key,
}: {
  scale: ResourceScale;
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
      return applySeriesList({
        ...params,
        bottom: [
          {
            title: `Return (%)`,
            seriesType: SeriesType.Based,
            dataset: params.datasets.date[`price_${key}_return`],
          },
        ],
      });
    },
  };
}
