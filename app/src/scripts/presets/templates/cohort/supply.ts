import { colors } from "/src/scripts/utils/colors";

import { datasetIdToPrefix } from "./utils";

export function createCohortPresetSupplyFolder({
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
    name: "Supply",
    tree: [
      {
        name: "Absolute",
        tree: [
          {
            scale,
            name: "All",
            title: `${title} Profit And Loss`,
            icon: () => IconTablerArrowsCross,
            description: "",
            unit: "US Dollars",
            bottom: [
              {
                title: "In Profit",
                color: colors.profit,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-profit`,
              },
              {
                title: "In Loss",
                color: colors.loss,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-loss`,
              },
              {
                title: "Total",
                color: colors.white,
                datasetPath: `/${scale}-to-${datasetPrefix}supply`,
              },
              {
                title: "Halved Total",
                color: colors.gray,
                datasetPath: `/${scale}-to-${datasetPrefix}halved-supply`,
                options: {
                  lineStyle: 4,
                },
              },
            ],
          },
          {
            scale,
            name: `Total`,
            title: `${title} Total supply`,
            icon: () => IconTablerSum,
            description: "",
            unit: "Bitcoin",
            bottom: [
              {
                title: "Supply",
                color,
                datasetPath: `/${scale}-to-${datasetPrefix}supply`,
              },
            ],
          },
          {
            scale,
            name: "In Profit",
            title: `${title} Supply In Profit`,
            description: "",
            unit: "Bitcoin",
            icon: () => IconTablerTrendingUp,
            bottom: [
              {
                title: "Supply",
                color: colors.profit,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-profit`,
              },
            ],
          },
          {
            scale,
            name: "In Loss",
            title: `${title} Supply In Loss`,
            description: "",
            unit: "Bitcoin",
            icon: () => IconTablerTrendingDown,
            bottom: [
              {
                title: "Supply",
                color: colors.loss,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-loss`,
              },
            ],
          },
        ],
      },
      {
        name: "Relative To Circulating",
        tree: [
          {
            scale,
            name: "All",
            title: `${title} Profit And Loss Relative To Circulating Supply`,
            description: "",
            unit: "Percentage",
            icon: () => IconTablerArrowsCross,
            bottom: [
              {
                title: "In Profit",
                color: colors.profit,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-profit-to-circulating-supply-ratio`,
              },
              {
                title: "In Loss",
                color: colors.loss,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-loss-to-circulating-supply-ratio`,
              },
              {
                title: "100%",
                color: colors.white,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-to-circulating-supply-ratio`,
              },
              {
                title: "50%",
                color: colors.gray,
                datasetPath: `/${scale}-to-${datasetPrefix}halved-supply-to-circulating-supply-ratio`,
                options: {
                  lineStyle: 4,
                },
              },
            ],
          },
          {
            scale,
            name: `Total`,
            title: `${title} Total supply Relative To Circulating Supply`,
            description: "",
            unit: "Percentage",
            icon: () => IconTablerSum,
            bottom: [
              {
                title: "Supply",
                color,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-to-circulating-supply-ratio`,
              },
            ],
          },
          {
            scale,
            name: "In Profit",
            title: `${title} Supply In Profit Relative To Circulating Supply`,
            description: "",
            unit: "Percentage",
            icon: () => IconTablerTrendingUp,
            bottom: [
              {
                title: "Supply",
                color: colors.profit,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-profit-to-circulating-supply-ratio`,
              },
            ],
          },
          {
            scale,
            name: "In Loss",
            title: `${title} Supply In Loss Relative To Circulating Supply`,
            description: "",
            unit: "Percentage",
            icon: () => IconTablerTrendingDown,
            bottom: [
              {
                title: "Supply",
                color: colors.loss,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-loss-to-circulating-supply-ratio`,
              },
            ],
          },
        ],
      },
      {
        name: "Relative To Own",
        tree: [
          {
            scale,
            name: "All",
            title: `${title} Supply In Profit And Loss Relative To Own Supply`,
            description: "",
            unit: "Percentage",
            icon: () => IconTablerArrowsCross,
            bottom: [
              {
                title: "In Profit",
                color: colors.profit,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-profit-to-own-supply-ratio`,
              },
              {
                title: "In Loss",
                color: colors.loss,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-loss-to-own-supply-ratio`,
              },
              {
                title: "100%",
                color: colors.white,
                datasetPath: `/${scale}-to-100`,
                options: {
                  lastValueVisible: false,
                },
              },
              {
                title: "50%",
                color: colors.gray,
                datasetPath: `/${scale}-to-50`,
                options: {
                  lineStyle: 4,
                  lastValueVisible: false,
                },
              },
            ],
          },
          {
            scale,
            name: "In Profit",
            title: `${title} Supply In Profit Relative To Own Supply`,
            description: "",
            unit: "Percentage",
            icon: () => IconTablerTrendingUp,
            bottom: [
              {
                title: "Supply",
                color: colors.profit,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-profit-to-own-supply-ratio`,
              },
            ],
          },
          {
            scale,
            name: "In Loss",
            title: `${title} Supply In Loss Relative To Own Supply`,
            description: "",
            unit: "Percentage",
            icon: () => IconTablerTrendingDown,
            bottom: [
              {
                title: "Supply",
                color: colors.loss,
                datasetPath: `/${scale}-to-${datasetPrefix}supply-in-loss-to-own-supply-ratio`,
              },
            ],
          },
        ],
      },
      // createMomentumPresetFolder({
      //   datasets: datasets[scale],
      //   scale,
      //   id: `${scale}-${id}-supply-in-profit-and-loss-percentage-self`,
      //   title: `${title} Supply In Profit And Loss (% Self)`,
      //   datasetId: `${datasetId}SupplyPNL%Self`,
      // }),
    ],
  };
}
