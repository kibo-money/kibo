import {
  compoundReturns,
  totalReturns,
} from "/src/scripts/datasets/consts/returns";

import { SeriesType } from "../../enums";

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
              key: `${key}-total`,
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
              key: `${key}-compound`,
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
  key: `${TotalReturnKey}-total` | `${CompoundReturnKey}-compound`;
}): PartialPreset {
  return {
    scale,
    name,
    description: "",
    icon: IconTablerReceiptTax,
    title: `${title} Return`,
    bottom: [
      {
        title: `Return (%)`,
        seriesType: SeriesType.Based,
        datasetPath: `/date-to-price-${key}-return`,
      },
    ],
  };
}
