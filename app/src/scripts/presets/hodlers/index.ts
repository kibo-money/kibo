import {
  fromXCohorts,
  fromXToYCohorts,
  upToCohorts,
  xthCohorts,
  yearCohorts,
} from "../../datasets/consts/age";
import { colors } from "../../utils/colors";
import { createCohortPresetFolder } from "../templates/cohort";

export function createPresets(scale: ResourceScale) {
  return {
    name: "Hodlers",
    tree: [
      {
        scale,
        name: `Hodl Supply`,
        title: `Hodl Supply`,
        description: "",
        icon: IconTablerRipple,
        unit: "Percentage",
        bottom: [
          {
            title: `24h`,
            color: colors.up_to_1d,
            datasetPath: `/${scale}-to-up-to-1d-supply-to-circulating-supply-ratio`,
          },

          ...fromXToYCohorts.map(({ key, id, name, legend }) => ({
            title: legend,
            color: colors[key],
            datasetPath:
              `/${scale}-to-${id}-supply-to-circulating-supply-ratio` as const,
          })),

          {
            title: `15y+`,
            color: colors.from_15y,
            datasetPath: `/${scale}-to-from-15y-supply-to-circulating-supply-ratio`,
          },
        ],
      },
      ...xthCohorts.map(({ key, id, name, legend }) =>
        createCohortPresetFolder({
          scale,
          color: colors[key],
          name: legend,
          datasetId: id,
          title: name,
        }),
      ),
      {
        name: "Up To X",
        tree: upToCohorts.map(({ key, id, name }) =>
          createCohortPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetId: id,
            title: name,
          }),
        ),
      },
      {
        name: "From X To Y",
        tree: fromXToYCohorts.map(({ key, id, name }) =>
          createCohortPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetId: id,
            title: name,
          }),
        ),
      },
      {
        name: "From X",
        tree: fromXCohorts.map(({ key, id, name }) =>
          createCohortPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetId: id,
            title: name,
          }),
        ),
      },
      {
        name: "Years",
        tree: yearCohorts.map(({ key, id, name }) =>
          createCohortPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetId: id,
            title: name,
          }),
        ),
      },
    ],
  } satisfies PartialPresetFolder;
}
