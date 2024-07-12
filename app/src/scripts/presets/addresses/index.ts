import {
  addressCohortsBySize,
  addressCohortsByType,
} from "../../datasets/consts/address";
import { liquidities } from "../../datasets/consts/liquidities";
import { colors } from "../../utils/colors";
import { createCohortPresetList } from "../templates/cohort";

export function createPresets(scale: ResourceScale): PartialPresetFolder {
  return {
    name: "Addresses",
    tree: [
      {
        scale,
        name: `Total Non Empty Addresses`,
        title: `Total Non Empty Address`,
        description: "",
        icon: IconTablerWallet,
        bottom: [
          {
            title: `Total Non Empty Address`,
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-address-count`,
          },
        ],
      },
      {
        scale,
        name: `New Addresses`,
        title: `New Addresses`,
        description: "",
        icon: IconTablerSparkles,
        bottom: [
          {
            title: `New Addresses`,
            color: colors.white,
            datasetPath: `/${scale}-to-created-addresses`,
          },
        ],
      },
      {
        scale,
        name: `Total Addresses Created`,
        title: `Total Addresses Created`,
        description: "",
        icon: IconTablerArchive,
        bottom: [
          {
            title: `Total Addresses Created`,
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-created-addresses`,
          },
        ],
      },
      {
        scale,
        name: `Total Empty Addresses`,
        title: `Total Empty Addresses`,
        description: "",
        icon: IconTablerTrash,
        bottom: [
          {
            title: `Total Empty Addresses`,
            color: colors.darkWhite,
            datasetPath: `/${scale}-to-empty-addresses`,
          },
        ],
      },
      {
        name: "By Size",
        tree: addressCohortsBySize.map(({ key, name }) =>
          createAddressPresetFolder({
            scale,
            color: colors[key],
            name,
            datasetId: key,
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
            datasetId: key,
          }),
        ),
      },
    ],
  } satisfies PartialPresetFolder;
}

function createAddressPresetFolder({
  scale,
  color,
  name,
  datasetId,
}: {
  scale: ResourceScale;
  name: string;
  datasetId: AddressCohortId;
  color: Color;
}): PartialPresetFolder {
  return {
    name,
    tree: [
      createAddressCountPreset({ scale, name, datasetId, color }),
      ...createCohortPresetList({
        title: name,
        scale,
        name,
        color,
        datasetId,
      }),
      createLiquidityFolder({
        scale,
        name,
        datasetId,
        color,
      }),
    ],
  };
}

export function createLiquidityFolder({
  scale,
  color,
  name,
  datasetId,
}: {
  scale: ResourceScale;
  name: string;
  datasetId: AddressCohortId | "";
  color: Color;
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
          datasetId: !datasetId ? liquidity.id : `${liquidity.id}-${datasetId}`,
        }),
      }),
    ),
  };
}

export function createAddressCountPreset({
  scale,
  color,
  name,
  datasetId,
}: {
  scale: ResourceScale;
  name: string;
  datasetId: AddressCohortId;
  color: Color;
}): PartialPreset {
  const addressCount: SeriesConfig = {
    title: "Address Count",
    color,
    datasetPath: `/${scale}-to-${datasetId}-address-count`,
  };

  return {
    scale,
    name: `Address Count`,
    title: `${name} Address Count`,
    icon: IconTablerAddressBook,
    description: "",
    bottom: [addressCount],
  };
}
