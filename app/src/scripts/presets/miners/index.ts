import { colors } from "../../utils/colors";
import { SeriesType } from "../enums";

export function createPresets(scale: ResourceScale) {
  return {
    name: "Miners",
    tree: [
      {
        name: "Coinbases",
        tree: [
          ...(scale === "date"
            ? ([
                {
                  name: "Last",
                  tree: [
                    {
                      scale,
                      icon: IconTablerCoinBitcoin,
                      name: "In Bitcoin",
                      title: "Last Coinbase In Bitcoin",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Last",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-last-coinbase`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCoin,
                      name: "In Dollars",
                      title: "Last Coinbase In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Last",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-last-coinbase-in-dollars`,
                        },
                      ],
                    },
                  ],
                },
                {
                  scale,
                  name: "Daily Sum",
                  tree: [
                    {
                      scale,
                      icon: IconTablerMoneybag,
                      name: "In Bitcoin",
                      title: "Daily Sum Of Coinbases In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-coinbase`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Daily Sum Of Coinbases In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-coinbase-in-dollars`,
                        },
                      ],
                    },
                  ],
                },
                {
                  scale,
                  name: "Yearly Sum",
                  tree: [
                    {
                      scale,
                      icon: IconTablerMoneybag,
                      name: "In Bitcoin",
                      title: "Yearly Sum Of Coinbases In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-coinbase-1y-sum`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Yearly Sum Of Coinbases In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-coinbase-in-dollars-1y-sum`,
                        },
                      ],
                    },
                  ],
                },
                {
                  scale,
                  name: "Cumulative",
                  tree: [
                    {
                      scale,
                      icon: IconTablerMoneybag,
                      name: "In Bitcoin",
                      title: "Cumulative Coinbases In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Coinbases",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-cumulative-coinbase`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Cumulative Coinbases In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Coinbases",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-cumulative-coinbase-in-dollars`,
                        },
                      ],
                    },
                  ],
                },
              ] satisfies PartialPresetTree)
            : []),
        ],
      },

      {
        name: "Subsidies",
        tree: [
          ...(scale === "date"
            ? ([
                {
                  name: "Last",
                  tree: [
                    {
                      scale,
                      icon: IconTablerCoinBitcoin,
                      name: "In Bitcoin",
                      title: "Last Subsidy In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Last",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-last-subsidy`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCoin,
                      name: "In Dollars",
                      title: "Last Subsidy In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Last",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-last-subsidy-in-dollars`,
                        },
                      ],
                    },
                  ],
                },
                {
                  scale,
                  name: "Daily Sum",
                  tree: [
                    {
                      scale,
                      icon: IconTablerMoneybag,
                      name: "In Bitcoin",
                      title: "Daily Sum Of Subsidies In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-subsidy`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Daily Sum Of Subsidies In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-subsidy-in-dollars`,
                        },
                      ],
                    },
                  ],
                },
                {
                  scale,
                  name: "Yearly Sum",
                  tree: [
                    {
                      scale,
                      icon: IconTablerMoneybag,
                      name: "In Bitcoin",
                      title: "Yearly Sum Of Subsidies In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-subsidy-1y-sum`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Yearly Sum Of Subsidies In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-subsidy-in-dollars-1y-sum`,
                        },
                      ],
                    },
                  ],
                },
                {
                  scale,
                  name: "Cumulative",
                  tree: [
                    {
                      scale,
                      icon: IconTablerMoneybag,
                      name: "In Bitcoin",
                      title: "Cumulative Subsidies In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Subsidies",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-cumulative-subsidy`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Cumulative Subsidies In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Subsidies",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-cumulative-subsidy-in-dollars`,
                        },
                      ],
                    },
                  ],
                },
              ] satisfies PartialPresetTree)
            : []),
        ],
      },

      {
        name: "Fees",
        tree: [
          ...(scale === "date"
            ? ([
                {
                  name: "Last",
                  tree: [
                    {
                      scale,
                      icon: IconTablerCoinBitcoin,
                      name: "In Bitcoin",
                      title: "Last Fees In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Last",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-last-fees`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCoin,
                      name: "In Dollars",
                      title: "Last Fees In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Last",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-last-fees-in-dollars`,
                        },
                      ],
                    },
                  ],
                },
                {
                  scale,
                  name: "Daily Sum",
                  tree: [
                    {
                      scale,
                      icon: IconTablerMoneybag,
                      name: "In Bitcoin",
                      title: "Daily Sum Of Fees In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-fees`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Daily Sum Of Fees In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-fees-in-dollars`,
                        },
                      ],
                    },
                  ],
                },
                {
                  scale,
                  name: "Yearly Sum",
                  tree: [
                    {
                      scale,
                      icon: IconTablerMoneybag,
                      name: "In Bitcoin",
                      title: "Yearly Sum Of Fees In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-fees-1y-sum`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Yearly Sum Of Fees In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Sum",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-fees-in-dollars-1y-sum`,
                        },
                      ],
                    },
                  ],
                },
                {
                  scale,
                  name: "Cumulative",
                  tree: [
                    {
                      scale,
                      icon: IconTablerMoneybag,
                      name: "In Bitcoin",
                      title: "Cumulative Fees In Bitcoin",
                      description: "",
                      unit: "Bitcoin",
                      bottom: [
                        {
                          title: "Fees",
                          color: colors.bitcoin,
                          datasetPath: `/${scale}-to-cumulative-fees`,
                        },
                      ],
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Cumulative Fees In Dollars",
                      description: "",
                      unit: "US Dollars",
                      bottom: [
                        {
                          title: "Fees",
                          color: colors.dollars,
                          datasetPath: `/${scale}-to-cumulative-fees-in-dollars`,
                        },
                      ],
                    },
                  ],
                },
              ] satisfies PartialPresetTree)
            : []),
        ],
      },

      {
        scale,
        icon: IconTablerSwords,
        name: "Subsidy V. Fees",
        title: "Subsidy V. Fees",
        description: "",
        unit: "Percentage",
        bottom: [
          {
            title: "Subsidy",
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-subsidy-to-coinbase-ratio`,
          },
          {
            title: "Fees",
            color: colors.darkBitcoin,
            datasetPath: `/${scale}-to-fees-to-coinbase-ratio`,
          },
        ],
      },

      ...(scale === "date"
        ? ([
            {
              scale,
              icon: IconTablerCalculator,
              name: "Puell Multiple",
              title: "Puell Multiple",
              description: "",
              unit: "",
              bottom: [
                {
                  title: "Multiple",
                  color: colors.bitcoin,
                  datasetPath: `/date-to-puell-multiple`,
                },
              ],
            },

            {
              scale,
              icon: IconTablerPick,
              name: "Hash Rate",
              title: "Hash Rate",
              description: "",
              unit: "ExaHash / Second",
              bottom: [
                {
                  title: "1M SMA",
                  color: colors.momentumYellow,
                  datasetPath: `/date-to-hash-rate-1m-sma`,
                },
                {
                  title: "1W SMA",
                  color: colors.bitcoin,
                  datasetPath: `/date-to-hash-rate-1w-sma`,
                },
                {
                  title: "Rate",
                  color: colors.darkBitcoin,
                  datasetPath: `/date-to-hash-rate`,
                },
              ],
            },
            {
              scale,
              icon: IconTablerRibbonHealth,
              name: "Hash Ribbon",
              title: "Hash Ribbon",
              description: "",
              unit: "ExaHash / Second",
              bottom: [
                {
                  title: "1M SMA",
                  color: colors.profit,
                  datasetPath: `/date-to-hash-rate-1m-sma`,
                },
                {
                  title: "2M SMA",
                  color: colors.loss,
                  datasetPath: `/date-to-hash-rate-2m-sma`,
                },
              ],
            },
            {
              scale,
              icon: IconTablerTag,
              name: "Hash Price",
              title: "Hash Price",
              description: "",
              unit: "Dollars / (PetaHash / Second)",
              bottom: [
                {
                  title: "Price",
                  color: colors.dollars,
                  datasetPath: `/date-to-hash-price`,
                },
              ],
            },
          ] as const satisfies PartialPreset[])
        : []),

      {
        scale,
        icon: IconTablerWeight,
        name: "Difficulty",
        title: "Difficulty",
        description: "",
        unit: "",
        bottom: [
          {
            title: "Difficulty",
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-difficulty`,
          },
        ],
      },

      ...(scale === "date"
        ? ([
            {
              scale,
              icon: IconTablerAdjustments,
              name: "Difficulty Adjustment",
              title: "Difficulty Adjustment",
              description: "",
              unit: "Percentage",
              bottom: [
                {
                  title: "Adjustment",
                  seriesType: SeriesType.Based,
                  datasetPath: `/${scale}-to-difficulty-adjustment`,
                },
              ],
            },
          ] satisfies PartialPreset[])
        : []),

      {
        scale,
        icon: IconTablerBuildingFactory,
        name: "Annualized Issuance",
        title: "Annualized Issuance",
        description: "",
        unit: "Bitcoin",
        bottom: [
          {
            title: "Issuance",
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-annualized-issuance`,
          },
        ],
      },

      {
        scale,
        icon: IconTablerBuildingFactory2,
        name: "Yearly Inflation Rate",
        title: "Yearly Inflation Rate",
        description: "",
        unit: "Percentage",
        bottom: [
          {
            title: "Rate",
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-yearly-inflation-rate`,
          },
        ],
      },

      // For scale === "height"
      // block_size,
      // block_weight,
      // block_vbytes,
      // block_interval,
    ],
  } satisfies PartialPresetFolder;
}
