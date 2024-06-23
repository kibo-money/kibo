import {
  addressCohortsBySize,
  addressCohortsByType,
} from "../../datasets/consts/address";
import { liquidities } from "../../datasets/consts/liquidities";
import { colors } from "../../utils/colors";
import { createCohortPresetList } from "../templates/cohort";
import { applyMultipleSeries, SeriesType } from "../templates/multiple";

export function createPresets({
  scale,
  datasets,
}: {
  scale: ResourceScale;
  datasets: Datasets;
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
          return applyMultipleSeries({
            ...params,
            priceScaleOptions: {
              halved: true,
            },
            list: [
              {
                title: `Total Non Empty Address`,
                color: colors.bitcoin,
                seriesType: SeriesType.Area,
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
          return applyMultipleSeries({
            ...params,
            priceScaleOptions: {
              halved: true,
            },
            list: [
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
          return applyMultipleSeries({
            ...params,
            priceScaleOptions: {
              halved: true,
            },
            list: [
              {
                title: `Total Addresses Created`,
                color: colors.bitcoin,
                seriesType: SeriesType.Area,
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
          return applyMultipleSeries({
            ...params,
            priceScaleOptions: {
              halved: true,
            },
            list: [
              {
                title: `Total Empty Addresses`,
                color: colors.darkWhite,
                seriesType: SeriesType.Area,
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
            datasets,
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
            datasets,
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
  datasets,
  scale,
  color,
  name,
  datasetKey,
}: {
  datasets: Datasets;
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
        datasets,
        scale,
        name,
        color,
        datasetKey,
      }),
      {
        name: `Split By Liquidity`,
        tree: liquidities.map(
          (liquidity): PartialPresetFolder => ({
            name: liquidity.name,
            tree: createCohortPresetList({
              title: `${liquidity.name} ${name}`,
              name: `${liquidity.name} ${name}`,
              datasets,
              scale,
              color,
              datasetKey: `${liquidity.key}_${datasetKey}`,
            }),
          }),
        ),
      },
    ],
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
      return applyMultipleSeries({
        ...params,
        priceScaleOptions: {
          halved: true,
        },
        list: [
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
