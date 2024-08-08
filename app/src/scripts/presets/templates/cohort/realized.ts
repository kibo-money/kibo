import { colors } from "/src/scripts/utils/colors";

import { SeriesType } from "../../enums";
import { createRatioFolder } from "../ratio";
import { datasetIdToPrefix } from "./utils";

export function createCohortPresetRealizedFolder({
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
    name: "Realized",
    tree: [
      {
        scale,
        name: `Price`,
        title: `${title} Realized Price`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerTag,
        top: [
          {
            title: "Realized Price",
            color,
            datasetPath: `${scale}-to-${datasetPrefix}realized-price`,
          },
        ],
      },
      createRatioFolder({
        scale,
        color,
        ratioDatasetPath: `${scale}-to-market-price-to-${datasetPrefix}realized-price-ratio`,
        valueDatasetPath: `${scale}-to-${datasetPrefix}realized-price`,
        title: `${title} Realized Price`,
      }),
      {
        scale,
        name: `Capitalization`,
        title: `${title} Realized Capitalization`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerPigMoney,
        bottom: [
          {
            title: `${name} Realized Cap.`,
            color,
            datasetPath: `${scale}-to-${datasetPrefix}realized-cap`,
          },
          ...(datasetId
            ? ([
                {
                  title: "Realized Cap.",
                  color: colors.bitcoin,
                  datasetPath: `${scale}-to-realized-cap`,
                  defaultVisible: false,
                },
              ] as const)
            : []),
        ],
      },
      {
        scale,
        name: `Capitalization 1M Net Change`,
        title: `${title} Realized Capitalization 1 Month Net Change`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerStatusChange,
        bottom: [
          {
            title: `Net Change`,
            seriesType: SeriesType.Based,
            datasetPath: `${scale}-to-${datasetPrefix}realized-cap-1m-net-change`,
          },
        ],
      },
      {
        scale,
        name: `Profit`,
        title: `${title} Realized Profit`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerCash,
        bottom: [
          {
            title: "Realized Profit",
            datasetPath: `${scale}-to-${datasetPrefix}realized-profit`,
            color: colors.profit,
          },
        ],
      },
      {
        scale,
        name: "Loss",
        title: `${title} Realized Loss`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerCoffin,
        bottom: [
          {
            title: "Realized Loss",
            datasetPath: `${scale}-to-${datasetPrefix}realized-loss`,
            color: colors.loss,
          },
        ],
      },
      {
        scale,
        name: `PNL`,
        title: `${title} Realized Profit And Loss`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerArrowsVertical,
        bottom: [
          {
            title: "Profit",
            color: colors.profit,
            datasetPath: `${scale}-to-${datasetPrefix}realized-profit`,
            seriesType: SeriesType.Based,
          },
          {
            title: "Loss",
            color: colors.loss,
            datasetPath: `${scale}-to-${datasetPrefix}negative-realized-loss`,
            seriesType: SeriesType.Based,
          },
        ],
      },
      {
        scale,
        name: `Net PNL`,
        title: `${title} Net Realized Profit And Loss`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerScale,
        bottom: [
          {
            title: "Net PNL",
            seriesType: SeriesType.Based,
            datasetPath: `${scale}-to-${datasetPrefix}net-realized-profit-and-loss`,
          },
        ],
      },
      {
        scale,
        name: `Net PNL Relative To Market Cap`,
        title: `${title} Net Realized Profit And Loss Relative To Market Capitalization`,
        description: "",
        unit: "Percentage",
        icon: () => IconTablerDivide,
        bottom: [
          {
            title: "Net",
            seriesType: SeriesType.Based,
            datasetPath: `${scale}-to-${datasetPrefix}net-realized-profit-and-loss-to-market-cap-ratio`,
          },
        ],
      },
      {
        scale,
        name: `Cumulative Profit`,
        title: `${title} Cumulative Realized Profit`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerSum,
        bottom: [
          {
            title: "Cumulative Realized Profit",
            color: colors.profit,
            datasetPath: `${scale}-to-${datasetPrefix}cumulative-realized-profit`,
          },
        ],
      },
      {
        scale,
        name: "Cumulative Loss",
        title: `${title} Cumulative Realized Loss`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerSum,
        bottom: [
          {
            title: "Cumulative Realized Loss",
            color: colors.loss,
            datasetPath: `${scale}-to-${datasetPrefix}cumulative-realized-loss`,
          },
        ],
      },
      {
        scale,
        name: `Cumulative Net PNL`,
        title: `${title} Cumulative Net Realized Profit And Loss`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerSum,
        bottom: [
          {
            title: "Cumulative Net Realized PNL",
            seriesType: SeriesType.Based,
            datasetPath: `${scale}-to-${datasetPrefix}cumulative-net-realized-profit-and-loss`,
          },
        ],
      },
      {
        scale,
        name: `Cumulative Net PNL 30 Day Change`,
        title: `${title} Cumulative Net Realized Profit And Loss 30 Day Change`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerTimeDuration30,
        bottom: [
          {
            title: "Cumulative Net Realized PNL 30d Change",
            datasetPath: `${scale}-to-${datasetPrefix}cumulative-net-realized-profit-and-loss-1m-net-change`,
            seriesType: SeriesType.Based,
          },
        ],
      },
      {
        scale,
        name: `Value Created`,
        title: `${title} Value Created`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerPlus,
        bottom: [
          {
            title: "Value",
            color: colors.profit,
            datasetPath: `${scale}-to-${datasetPrefix}value-created`,
          },
        ],
      },
      {
        scale,
        name: `Value Destroyed`,
        title: `${title} Value Destroyed`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerMinus,
        bottom: [
          {
            title: "Value",
            color: colors.loss,
            datasetPath: `${scale}-to-${datasetPrefix}value-destroyed`,
          },
        ],
      },
      {
        scale,
        name: `Spent Output Profit Ratio - SOPR`,
        title: `${title} Spent Output Profit Ratio`,
        description: "",
        unit: "Percentage",
        icon: () => IconTablerMathXDivideY,
        bottom: [
          {
            title: "SOPR",
            datasetPath: `${scale}-to-${datasetPrefix}spent-output-profit-ratio`,
            seriesType: SeriesType.Based,
            options: {
              base: 1,
            },
          },
        ],
      },
    ],
  };
}
