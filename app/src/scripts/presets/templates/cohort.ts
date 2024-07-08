import { percentiles } from "../../datasets/consts/percentiles";
import { colors } from "../../utils/colors";
import { applySeriesList, SeriesType } from "../apply";

export function createCohortPresetFolder<Scale extends ResourceScale>({
  scale,
  color,
  name,
  datasetKey,
  title,
}: {
  scale: Scale;
  name: string;
  datasetKey: AnyPossibleCohortKey;
  color: Color;
  title: string;
}) {
  return {
    name,
    tree: createCohortPresetList({
      title,
      name,
      scale,
      color,
      datasetKey,
    }),
  } satisfies PartialPresetFolder;
}

export function createCohortPresetList<Scale extends ResourceScale>({
  name,
  scale,
  color,
  datasetKey,
  title,
}: {
  name: string;
  scale: Scale;
  datasetKey: AnyPossibleCohortKey;
  title: string;
  color: Color;
}) {
  const datasetPrefix = datasetKey
    ? (`${datasetKey}_` as const)
    : ("" as const);

  return [
    {
      name: "UTXOs",
      tree: [
        {
          scale,
          name: `Count`,
          title: `${title} Unspent Transaction Outputs Count`,
          icon: () => IconTablerTicket,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Count",
                  color,
                  dataset: params.datasets[scale][`${datasetPrefix}utxo_count`],
                },
              ],
            });
          },
          description: "",
        },
      ],
    },
    {
      name: "Realized",
      tree: [
        {
          scale,
          name: `Price`,
          title: `${title} Realized Price`,
          description: "",
          icon: () => IconTablerTag,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              top: [
                {
                  title: "Realized Price",
                  color,
                  dataset:
                    params.datasets[scale][`${datasetPrefix}realized_price`],
                },
              ],
            });
          },
        },
        {
          scale,
          name: `Capitalization`,
          title: `${title} Realized Capitalization`,
          icon: () => IconTablerPigMoney,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: `${name} Realized Cap.`,
                  color,
                  dataset:
                    params.datasets[scale][`${datasetPrefix}realized_cap`],
                },
                ...(datasetKey
                  ? [
                      {
                        title: "Realized Cap.",
                        color: colors.bitcoin,
                        dataset: params.datasets[scale].realized_cap,
                        defaultVisible: false,
                      },
                    ]
                  : []),
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `Capitalization 1M Net Change`,
          title: `${title} Realized Capitalization 1 Month Net Change`,
          icon: () => IconTablerStatusChange,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: `Net Change`,
                  seriesType: SeriesType.Based,
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}realized_cap_1m_net_change`
                    ],
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `Profit`,
          title: `${title} Realized Profit`,
          icon: () => IconTablerCash,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Realized Profit",
                  dataset:
                    params.datasets[scale][`${datasetPrefix}realized_profit`],
                  color: colors.profit,
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: "Loss",
          title: `${title} Realized Loss`,
          icon: () => IconTablerCoffin,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Realized Loss",
                  dataset:
                    params.datasets[scale][`${datasetPrefix}realized_loss`],
                  color: colors.loss,
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `PNL`,
          title: `${title} Realized Profit And Loss`,
          icon: () => IconTablerArrowsVertical,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Profit",
                  color: colors.profit,
                  dataset:
                    params.datasets[scale][`${datasetPrefix}realized_profit`],
                  seriesType: SeriesType.Based,
                },
                {
                  title: "Loss",
                  color: colors.loss,
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}negative_realized_loss`
                    ],
                  seriesType: SeriesType.Based,
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `Net PNL`,
          title: `${title} Net Realized Profit And Loss`,
          icon: () => IconTablerScale,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Net PNL",
                  seriesType: SeriesType.Based,
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}net_realized_profit_and_loss`
                    ],
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `Net PNL Relative To Market Cap`,
          title: `${title} Net Realized Profit And Loss Relative To Market Capitalization`,
          icon: () => IconTablerDivide,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Net",
                  seriesType: SeriesType.Based,
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}net_realized_profit_and_loss_to_market_cap_ratio`
                    ],
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `Cumulative Profit`,
          title: `${title} Cumulative Realized Profit`,
          icon: () => IconTablerSum,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Cumulative Realized Profit",
                  color: colors.profit,
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}cumulative_realized_profit`
                    ],
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: "Cumulative Loss",
          title: `${title} Cumulative Realized Loss`,
          icon: () => IconTablerSum,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Cumulative Realized Loss",
                  color: colors.loss,
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}cumulative_realized_loss`
                    ],
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `Cumulative Net PNL`,
          title: `${title} Cumulative Net Realized Profit And Loss`,
          icon: () => IconTablerSum,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Cumulative Net Realized PNL",
                  seriesType: SeriesType.Based,
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}cumulative_net_realized_profit_and_loss`
                    ],
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `Cumulative Net PNL 30 Day Change`,
          title: `${title} Cumulative Net Realized Profit And Loss 30 Day Change`,
          icon: () => IconTablerTimeDuration30,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Cumulative Net Realized PNL 30d Change",
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}cumulative_net_realized_profit_and_loss_1m_net_change`
                    ],
                  seriesType: SeriesType.Based,
                },
              ],
            });
          },
          description: "",
        },
      ],
    },
    {
      name: "Unrealized",
      tree: [
        {
          scale,
          name: `Profit`,
          title: `${title} Unrealized Profit`,
          icon: () => IconTablerMoodDollar,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Profit",
                  dataset:
                    params.datasets[scale][`${datasetPrefix}unrealized_profit`],
                  color: colors.profit,
                },
              ],
            });
          },
          description: "",
        },

        {
          scale,
          name: "Loss",
          title: `${title} Unrealized Loss`,
          icon: () => IconTablerMoodSadDizzy,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Loss",
                  dataset:
                    params.datasets[scale][`${datasetPrefix}unrealized_loss`],
                  color: colors.loss,
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `PNL`,
          title: `${title} Unrealized Profit And Loss`,
          icon: () => IconTablerArrowsVertical,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Profit",
                  color: colors.profit,
                  dataset:
                    params.datasets[scale][`${datasetPrefix}unrealized_profit`],
                  seriesType: SeriesType.Based,
                },
                {
                  title: "Loss",
                  color: colors.loss,
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}negative_unrealized_loss`
                    ],
                  seriesType: SeriesType.Based,
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `Net PNL`,
          title: `${title} Net Unrealized Profit And Loss`,
          icon: () => IconTablerScale,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Net Unrealized PNL",
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}net_unrealized_profit_and_loss`
                    ],
                  seriesType: SeriesType.Based,
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `Net PNL Relative To Market Cap`,
          title: `${title} Net Unrealized Profit And Loss Relative To Total Market Capitalization`,
          icon: () => IconTablerDivide,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              bottom: [
                {
                  title: "Relative Net Unrealized PNL",
                  dataset:
                    params.datasets[scale][
                      `${datasetPrefix}net_unrealized_profit_and_loss_to_market_cap_ratio`
                    ],
                  seriesType: SeriesType.Based,
                },
              ],
            });
          },
          description: "",
        },
      ],
    },
    {
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
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "In Profit",
                      color: colors.profit,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_profit`
                        ],
                    },
                    {
                      title: "In Loss",
                      color: colors.loss,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_loss`
                        ],
                    },
                    {
                      title: "Total",
                      color: colors.white,
                      dataset: params.datasets[scale][`${datasetPrefix}supply`],
                    },
                    {
                      title: "Halved Total",
                      color: colors.gray,
                      dataset:
                        params.datasets[scale][`${datasetPrefix}halved_supply`],
                      options: {
                        lineStyle: 4,
                      },
                    },
                  ],
                });
              },
            },
            {
              scale,
              name: `Total`,
              title: `${title} Total supply`,
              icon: () => IconTablerSum,
              description: "",
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "Supply",
                      color,
                      dataset: params.datasets[scale][`${datasetPrefix}supply`],
                    },
                  ],
                });
              },
            },
            {
              scale,
              name: "In Profit",
              title: `${title} Supply In Profit`,
              icon: () => IconTablerTrendingUp,
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "Supply",
                      color: colors.profit,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_profit`
                        ],
                    },
                  ],
                });
              },
              description: "",
            },
            {
              scale,
              name: "In Loss",
              title: `${title} Supply In Loss`,
              icon: () => IconTablerTrendingDown,
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "Supply",
                      color: colors.loss,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_loss`
                        ],
                    },
                  ],
                });
              },
              description: "",
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
              icon: () => IconTablerArrowsCross,
              description: "",
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "In Profit",
                      color: colors.profit,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_profit_to_circulating_supply_ratio`
                        ],
                    },
                    {
                      title: "In Loss",
                      color: colors.loss,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_loss_to_circulating_supply_ratio`
                        ],
                    },
                    {
                      title: "100%",
                      color: colors.white,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_to_circulating_supply_ratio`
                        ],
                    },
                    {
                      title: "50%",
                      color: colors.gray,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}halved_supply_to_circulating_supply_ratio`
                        ],
                      options: {
                        lineStyle: 4,
                      },
                    },
                  ],
                });
              },
            },
            {
              scale,
              name: `Total`,
              title: `${title} Total supply Relative To Circulating Supply`,
              icon: () => IconTablerSum,
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "Supply",
                      color,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_to_circulating_supply_ratio`
                        ],
                    },
                  ],
                });
              },
              description: "",
            },
            {
              scale,
              name: "In Profit",
              title: `${title} Supply In Profit Relative To Circulating Supply`,
              icon: () => IconTablerTrendingUp,
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "Supply",
                      color: colors.profit,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_profit_to_circulating_supply_ratio`
                        ],
                    },
                  ],
                });
              },
              description: "",
            },
            {
              scale,
              name: "In Loss",
              title: `${title} Supply In Loss Relative To Circulating Supply`,
              icon: () => IconTablerTrendingDown,
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "Supply",
                      color: colors.loss,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_loss_to_circulating_supply_ratio`
                        ],
                    },
                  ],
                });
              },
              description: "",
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
              icon: () => IconTablerArrowsCross,
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "In Profit",
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_profit_to_own_supply_ratio`
                        ],
                      color: colors.profit,
                    },
                    {
                      title: "In Loss",
                      color: colors.loss,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_loss_to_own_supply_ratio`
                        ],
                    },
                    {
                      title: "100%",
                      color: colors.white,
                      dataset: params.datasets[scale][100],
                      options: {
                        lastValueVisible: false,
                      },
                    },
                    {
                      title: "50%",
                      color: colors.gray,
                      dataset: params.datasets[scale][50],
                      options: {
                        lineStyle: 4,
                        lastValueVisible: false,
                      },
                    },
                  ],
                });
              },
              description: "",
            },
            {
              scale,
              name: "In Profit",
              title: `${title} Supply In Profit Relative To Own Supply`,
              icon: () => IconTablerTrendingUp,
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "Supply",
                      color: colors.profit,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_profit_to_own_supply_ratio`
                        ],
                    },
                  ],
                });
              },
              description: "",
            },
            {
              scale,
              name: "In Loss",
              title: `${title} Supply In Loss Relative To Own Supply`,
              icon: () => IconTablerTrendingDown,
              applyPreset(params) {
                return applySeriesList({
                  ...params,
                  bottom: [
                    {
                      title: "Supply",
                      color: colors.loss,
                      dataset:
                        params.datasets[scale][
                          `${datasetPrefix}supply_in_loss_to_own_supply_ratio`
                        ],
                    },
                  ],
                });
              },
              description: "",
            },
          ],
        },
        // createMomentumPresetFolder({
        //   datasets: datasets[scale],
        //   scale,
        //   id: `${scale}-${id}-supply-in-profit-and-loss-percentage-self`,
        //   title: `${title} Supply In Profit And Loss (% Self)`,
        //   datasetKey: `${datasetKey}SupplyPNL%Self`,
        // }),
      ],
    },
    {
      name: "Prices Paid",
      tree: [
        {
          scale,
          name: `Average`,
          title: `${title} Average Price Paid - Realized Price`,
          icon: () => IconTablerMathAvg,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              top: [
                {
                  title: "Average",
                  color,
                  dataset:
                    params.datasets[scale][`${datasetPrefix}realized_price`],
                },
              ],
            });
          },
          description: "",
        },
        {
          scale,
          name: `Deciles`,
          title: `${title} deciles`,
          icon: () => IconTablerSquareHalf,
          applyPreset(params) {
            return applySeriesList({
              ...params,
              top: percentiles
                .filter(({ value }) => Number(value) % 10 === 0)
                .map(({ name, key }) => ({
                  dataset: params.datasets[scale][`${datasetPrefix}${key}`],
                  color,
                  title: name,
                })),
            });
          },
          description: "",
        },
        ...percentiles.map(
          (percentile): PartialPreset => ({
            scale,
            name: percentile.name,
            title: `${title} ${percentile.title}`,
            icon: () => IconTablerSquareHalf,
            applyPreset(params) {
              return applySeriesList({
                ...params,
                top: [
                  {
                    title: percentile.name,
                    color,
                    dataset:
                      params.datasets[scale][
                        `${datasetPrefix}${percentile.key}`
                      ],
                  },
                ],
              });
            },
            description: "",
          }),
        ),
      ],
    },
  ] satisfies PartialPresetTree;
}
