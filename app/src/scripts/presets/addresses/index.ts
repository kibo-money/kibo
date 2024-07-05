import {
  addressCohortsBySize,
  addressCohortsByType,
} from "../../datasets/consts/address";
import { liquidities } from "../../datasets/consts/liquidities";
import { colors } from "../../utils/colors";
import { applySeriesList, SeriesType } from "../apply";
import { createCohortPresetList } from "../templates/cohort";

export function createPresets({
  scale,
}: {
  scale: ResourceScale;
}): PartialPresetFolder {
  return {
    name: "Addresses",
    tree: [
      {
        scale,
        name: `Total Non Empty Addresses`,
        title: `Total Non Empty Address`,
        description: "",
        icon: IconTablerWallet,
        applyPreset(params) {
          return applySeriesList({
            ...params,
            bottom: [
              {
                title: `Total Non Empty Address`,
                color: colors.bitcoin,
                dataset: params.datasets[scale].address_count,
              },
            ],
          });
        },
      },
      {
        scale,
        name: `New Addresses`,
        title: `New Addresses`,
        description: "",
        icon: IconTablerSparkles,
        applyPreset(params) {
          return applySeriesList({
            ...params,
            bottom: [
              {
                title: `New Addresses`,
                color: colors.white,
                dataset: params.datasets[scale].created_addresses,
              },
            ],
          });
        },
      },
      {
        scale,
        name: `Total Addresses Created`,
        title: `Total Addresses Created`,
        description: "",
        icon: IconTablerArchive,
        applyPreset(params) {
          return applySeriesList({
            ...params,
            bottom: [
              {
                title: `Total Addresses Created`,
                color: colors.bitcoin,
                dataset: params.datasets[scale].created_addresses,
              },
            ],
          });
        },
      },
      {
        scale,
        name: `Total Empty Addresses`,
        title: `Total Empty Addresses`,
        description: "",
        icon: IconTablerTrash,
        applyPreset(params) {
          return applySeriesList({
            ...params,
            bottom: [
              {
                title: `Total Empty Addresses`,
                color: colors.darkWhite,
                dataset: params.datasets[scale].empty_addresses,
              },
            ],
          });
        },
      },
      {
        name: "By Size",
        tree: addressCohortsBySize.map(({ key, name }) =>
          createAddressPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetKey: key,
          }),
        ),
      },
      {
        scale,
        name: "By Type",
        tree: addressCohortsByType.map(({ key, name }) =>
          createAddressPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetKey: key,
          }),
        ),
      },
    ],
  } satisfies PartialPresetFolder;
}

function createAddressPresetFolder<Scale extends ResourceScale>({
  scale,
  color,
  name,
  datasetKey,
}: {
  scale: Scale;
  name: string;
  datasetKey: AddressCohortKey;
  color: string;
}): PartialPresetFolder {
  return {
    name,
    tree: [
      createAddressCountPreset({ scale, name, datasetKey, color }),
      ...createCohortPresetList({
        title: name,
        scale,
        name,
        color,
        datasetKey,
      }),
      createLiquidityFolder({
        scale,
        name,
        datasetKey,
        color,
      }),
    ],
  };
}

export function createLiquidityFolder<Scale extends ResourceScale>({
  scale,
  color,
  name,
  datasetKey,
}: {
  scale: Scale;
  name: string;
  datasetKey: AddressCohortKey | "";
  color: string;
}): PartialPresetFolder {
  return {
    name: `Split By Liquidity`,
    tree: liquidities.map(
      (liquidity): PartialPresetFolder => ({
        name: liquidity.name,
        tree: createCohortPresetList({
          title: `${liquidity.name} ${name}`,
          name: `${liquidity.name} ${name}`,
          scale,
          color,
          datasetKey: !datasetKey
            ? liquidity.key
            : `${liquidity.key}_${datasetKey}`,
        }),
      }),
    ),
  };
}

export function createAddressCountPreset<Scale extends ResourceScale>({
  scale,
  color,
  name,
  datasetKey,
}: {
  scale: Scale;
  name: string;
  datasetKey: AddressCohortKey;
  color: string;
}): PartialPreset {
  return {
    scale,
    name: `Address Count`,
    title: `${name} Address Count`,
    icon: IconTablerAddressBook,
    applyPreset(params) {
      return applySeriesList({
        ...params,
        bottom: [
          {
            title: "Address Count",
            color,
            dataset: params.datasets[scale][`${datasetKey}_address_count`],
          },
        ],
      });
    },
    description: "",
  };
}
