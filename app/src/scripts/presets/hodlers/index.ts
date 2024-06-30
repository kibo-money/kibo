import {
  fromXCohorts,
  fromXToYCohorts,
  upToCohorts,
  xthCohorts,
  yearCohorts,
} from "../../datasets/consts/age";
import { colors } from "../../utils/colors";
import { applySeriesList } from "../apply";
import { createCohortPresetFolder } from "../templates/cohort";

export function createPresets({ scale }: { scale: ResourceScale }) {
  return {
    name: "Hodlers",
    tree: [
      {
        scale,
        name: `Hodl Supply`,
        title: `Hodl Supply`,
        description: "",
        icon: IconTablerRipple,
        applyPreset(params) {
          return applySeriesList({
            ...params,
            bottom: [
              {
                title: `24h`,
                color: colors.up_to_1d,
                dataset:
                  params.datasets.date
                    .up_to_1d_supply_to_circulating_supply_ratio,
              },

              ...fromXToYCohorts.map(({ key, name, legend }) => ({
                title: legend,
                color: colors[key],
                dataset:
                  params.datasets.date[
                    `${key}_supply_to_circulating_supply_ratio`
                  ],
              })),

              {
                title: `15y+`,
                color: colors.from_15y,
                dataset:
                  params.datasets.date
                    .from_15y_supply_to_circulating_supply_ratio,
              },
            ],
          });
        },
      },
      ...xthCohorts.map(({ key, name, legend }) =>
        createCohortPresetFolder({
          scale,
          color: colors[key],
          name: legend,
          datasetKey: key,
          title: name,
        }),
      ),
      {
        name: "Up To X",
        tree: upToCohorts.map(({ key, name }) =>
          createCohortPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetKey: key,
            title: name,
          }),
        ),
      },
      {
        name: "From X To Y",
        tree: fromXToYCohorts.map(({ key, name }) =>
          createCohortPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetKey: key,
            title: name,
          }),
        ),
      },
      {
        name: "From X",
        tree: fromXCohorts.map(({ key, name }) =>
          createCohortPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetKey: key,
            title: name,
          }),
        ),
      },
      {
        name: "Years",
        tree: yearCohorts.map(({ key, name }) =>
          createCohortPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetKey: key,
            title: name,
          }),
        ),
      },
    ],
  } satisfies PartialPresetFolder;
}
