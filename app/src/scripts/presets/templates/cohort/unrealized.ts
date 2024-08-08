import { colors } from "/src/scripts/utils/colors";

import { SeriesType } from "../../enums";
import { datasetIdToPrefix } from "./utils";

export function createCohortPresetUnrealizedFolder({
  scale,
  color,
  datasetId,
  title,
}: {
  scale: ResourceScale;
  datasetId: AnyPossibleCohortId;
  title: string;
  color: Color;
}): PartialPresetFolder {
  const datasetPrefix = datasetIdToPrefix(datasetId);

  return {
    name: "Unrealized",
    tree: [
      {
        scale,
        name: `Profit`,
        title: `${title} Unrealized Profit`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerMoodDollar,
        bottom: [
          {
            title: "Profit",
            datasetPath: `${scale}-to-${datasetPrefix}unrealized-profit`,
            color: colors.profit,
          },
        ],
      },
      {
        scale,
        name: "Loss",
        title: `${title} Unrealized Loss`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerMoodSadDizzy,
        bottom: [
          {
            title: "Loss",
            datasetPath: `${scale}-to-${datasetPrefix}unrealized-loss`,
            color: colors.loss,
          },
        ],
      },
      {
        scale,
        name: `PNL`,
        title: `${title} Unrealized Profit And Loss`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerArrowsVertical,
        bottom: [
          {
            title: "Profit",
            color: colors.profit,
            datasetPath: `${scale}-to-${datasetPrefix}unrealized-profit`,
            seriesType: SeriesType.Based,
          },
          {
            title: "Loss",
            color: colors.loss,
            datasetPath: `${scale}-to-${datasetPrefix}negative-unrealized-loss`,
            seriesType: SeriesType.Based,
          },
        ],
      },
      {
        scale,
        name: `Net PNL`,
        title: `${title} Net Unrealized Profit And Loss`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerScale,
        bottom: [
          {
            title: "Net Unrealized PNL",
            datasetPath: `${scale}-to-${datasetPrefix}net-unrealized-profit-and-loss`,
            seriesType: SeriesType.Based,
          },
        ],
      },
      {
        scale,
        name: `Net PNL Relative To Market Cap`,
        title: `${title} Net Unrealized Profit And Loss Relative To Total Market Capitalization`,
        description: "",
        unit: "Percentage",
        icon: () => IconTablerDivide,
        bottom: [
          {
            title: "Relative Net Unrealized PNL",
            datasetPath: `${scale}-to-${datasetPrefix}net-unrealized-profit-and-loss-to-market-cap-ratio`,
            seriesType: SeriesType.Based,
          },
        ],
      },
    ],
  };
}
