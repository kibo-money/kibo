import { colors } from "../../utils/colors";
import { applyMultipleSeries, SeriesType } from "../templates/multiple";

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
                      title: "Last Coinbase (In Bitcoin)",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Last",
                              color: colors.bitcoin,
                              dataset: params.datasets[scale].last_coinbase,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCoin,
                      name: "In Dollars",
                      title: "Last Coinbase (In Dollars)",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Last",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale].last_coinbase_in_dollars,
                            },
                          ],
                        });
                      },
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
                      title: "Daily Sum Of Bitcoin Coinbases",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Coinbases (Bitcoin)",
                              color: colors.bitcoin,
                              dataset: params.datasets[scale].coinbase,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Daily Sum Of Dollar Coinbases",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Coinbases (Dollars)",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale].coinbase_in_dollars,
                            },
                          ],
                        });
                      },
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
                      title: "Yearly Sum Of Bitcoin Coinbases",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Coinbases (Bitcoin)",
                              color: colors.bitcoin,
                              dataset: params.datasets[scale].coinbase_1y_sum,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Yearly Sum Of Dollar Coinbases",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Coinbases (Dollars)",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale]
                                  .coinbase_in_dollars_1y_sum,
                            },
                          ],
                        });
                      },
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
                      title: "Cumulative Bitcoin Coinbases",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Coinbases (Bitcoin)",
                              color: colors.bitcoin,
                              dataset:
                                params.datasets[scale].cumulative_coinbase,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Cumulative Dollar Coinbases",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Coinbases (Dollars)",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale]
                                  .cumulative_coinbase_in_dollars,
                            },
                          ],
                        });
                      },
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
                      title: "Last Subsidy (In Bitcoin)",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Last",
                              color: colors.bitcoin,
                              dataset: params.datasets[scale].last_subsidy,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCoin,
                      name: "In Dollars",
                      title: "Last Subsidy (In Dollars)",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Last",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale].last_subsidy_in_dollars,
                            },
                          ],
                        });
                      },
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
                      title: "Daily Sum Of Bitcoin Subsidies",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Subsidies (Bitcoin)",
                              color: colors.bitcoin,
                              dataset: params.datasets[scale].subsidy,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Daily Sum Of Dollar Subsidies",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Subsidies (Dollars)",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale].subsidy_in_dollars,
                            },
                          ],
                        });
                      },
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
                      title: "Yearly Sum Of Bitcoin Subsidies",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Subsidies (Bitcoin)",
                              color: colors.bitcoin,
                              dataset: params.datasets[scale].subsidy_1y_sum,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Yearly Sum Of Dollar Subsidies",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Subsidies (Dollars)",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale]
                                  .subsidy_in_dollars_1y_sum,
                            },
                          ],
                        });
                      },
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
                      title: "Cumulative Bitcoin Subsidies",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Subsidies (Bitcoin)",
                              color: colors.bitcoin,
                              dataset:
                                params.datasets[scale].cumulative_subsidy,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Cumulative Dollar Subsidies",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Subsidies (Dollars)",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale]
                                  .cumulative_subsidy_in_dollars,
                            },
                          ],
                        });
                      },
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
                      title: "Last Fees (In Bitcoin)",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Last",
                              color: colors.bitcoin,
                              dataset: params.datasets[scale].last_fees,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCoin,
                      name: "In Dollars",
                      title: "Last Fees (In Dollars)",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Last",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale].last_fees_in_dollars,
                            },
                          ],
                        });
                      },
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
                      title: "Daily Sum Of Bitcoin Fees",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Fees (Bitcoin)",
                              color: colors.bitcoin,
                              dataset: params.datasets[scale].fees,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Daily Sum Of Dollar Fees",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Fees (Dollars)",
                              color: colors.dollars,
                              dataset: params.datasets[scale].fees_in_dollars,
                            },
                          ],
                        });
                      },
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
                      title: "Yearly Sum Of Bitcoin Fees",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Fees (Bitcoin)",
                              color: colors.bitcoin,
                              dataset: params.datasets[scale].fees_1y_sum,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Yearly Sum Of Dollar Fees",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Fees (Dollars)",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale].fees_in_dollars_1y_sum,
                            },
                          ],
                        });
                      },
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
                      title: "Cumulative Bitcoin Fees",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Fees (Bitcoin)",
                              color: colors.bitcoin,
                              dataset: params.datasets[scale].cumulative_fees,
                            },
                          ],
                        });
                      },
                    },
                    {
                      scale,
                      icon: IconTablerCash,
                      name: "In Dollars",
                      title: "Cumulative Dollar Fees",
                      description: "",
                      applyPreset(params) {
                        return applyMultipleSeries({
                          ...params,
                          priceScaleOptions: {
                            halved: true,
                          },
                          list: [
                            {
                              title: "Fees (Dollars)",
                              color: colors.dollars,
                              dataset:
                                params.datasets[scale]
                                  .cumulative_fees_in_dollars,
                            },
                          ],
                        });
                      },
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
        applyPreset(params) {
          return applyMultipleSeries({
            ...params,
            priceScaleOptions: {
              halved: true,
            },
            list: [
              {
                title: "Subsidy (%)",
                color: colors.bitcoin,
                dataset: params.datasets[scale].subsidy_to_coinbase_ratio,
              },
              {
                title: "Fees (%)",
                color: colors.darkBitcoin,
                dataset: params.datasets[scale].fees_to_coinbase_ratio,
              },
            ],
          });
        },
      },

      ...(scale === "date"
        ? ([
            {
              scale,
              icon: IconTablerCalculator,
              name: "Puell Multiple",
              title: "Puell Multiple",
              description: "",
              applyPreset(params) {
                return applyMultipleSeries({
                  ...params,
                  priceScaleOptions: {
                    halved: true,
                    mode: 1,
                  },
                  list: [
                    {
                      title: "Multiple",
                      color: colors.bitcoin,
                      dataset: params.datasets.date.puell_multiple,
                    },
                  ],
                });
              },
            },

            {
              scale,
              icon: IconTablerPick,
              name: "Hash Rate",
              title: "Hash Rate (EH/s)",
              description: "",
              applyPreset(params) {
                return applyMultipleSeries({
                  ...params,
                  priceScaleOptions: {
                    halved: true,
                    mode: 1,
                  },
                  list: [
                    {
                      title: "1M SMA",
                      color: colors.momentumYellow,
                      dataset: params.datasets.date.hash_rate_1m_sma,
                    },
                    {
                      title: "1W SMA",
                      color: colors.bitcoin,
                      dataset: params.datasets.date.hash_rate_1w_sma,
                    },
                    {
                      title: "Rate",
                      color: colors.darkBitcoin,
                      dataset: params.datasets.date.hash_rate,
                    },
                  ],
                });
              },
            },

            {
              scale,
              icon: IconTablerRibbonHealth,
              name: "Hash Ribbon",
              title: "Hash Ribbon (EH/s)",
              description: "",
              applyPreset(params) {
                return applyMultipleSeries({
                  ...params,
                  priceScaleOptions: {
                    halved: true,
                    mode: 1,
                  },
                  list: [
                    {
                      title: "1M SMA",
                      color: colors.profit,
                      dataset: params.datasets.date.hash_rate_1m_sma,
                    },
                    {
                      title: "2M SMA",
                      color: colors.loss,
                      dataset: params.datasets.date.hash_rate_2m_sma,
                    },
                  ],
                });
              },
            },

            {
              scale,
              icon: IconTablerTag,
              name: "Hash Price",
              title: "Hash Price",
              description: "",
              applyPreset(params) {
                return applyMultipleSeries({
                  ...params,
                  priceScaleOptions: {
                    halved: true,
                  },
                  list: [
                    {
                      title: "Price ($/PH/s)",
                      color: colors.dollars,
                      dataset: params.datasets.date.hash_price,
                    },
                  ],
                });
              },
            },
          ] satisfies PartialPreset[])
        : []),

      {
        scale,
        icon: IconTablerWeight,
        name: "Difficulty",
        title: "Difficulty",
        description: "",
        applyPreset(params) {
          return applyMultipleSeries({
            ...params,
            priceScaleOptions: {
              halved: true,
              mode: 1,
            },
            list: [
              {
                title: "Difficulty",
                color: colors.bitcoin,
                dataset: params.datasets[scale].difficulty,
              },
            ],
          });
        },
      },

      ...(scale === "date"
        ? ([
            {
              scale,
              icon: IconTablerAdjustments,
              name: "Difficulty Adjustment",
              title: "Difficulty Adjustment",
              description: "",
              applyPreset(params) {
                return applyMultipleSeries({
                  ...params,
                  priceScaleOptions: {
                    halved: true,
                  },
                  list: [
                    {
                      title: "Adjustment (%)",
                      // color: colors.bitcoin,
                      seriesType: SeriesType.Based,
                      dataset: params.datasets[scale].difficulty_adjustment,
                    },
                  ],
                });
              },
            },
          ] satisfies PartialPreset[])
        : []),

      {
        scale,
        icon: IconTablerBuildingFactory,
        name: "Annualized Issuance",
        title: "Annualized Issuance",
        description: "",
        applyPreset(params) {
          return applyMultipleSeries({
            ...params,
            priceScaleOptions: {
              halved: true,
              mode: 1,
            },
            list: [
              {
                title: "Issuance",
                color: colors.bitcoin,
                dataset: params.datasets[scale].annualized_issuance,
              },
            ],
          });
        },
      },

      {
        scale,
        icon: IconTablerBuildingFactory2,
        name: "Yearly Inflation Rate",
        title: "Yearly Inflation Rate",
        description: "",
        applyPreset(params) {
          return applyMultipleSeries({
            ...params,
            priceScaleOptions: {
              halved: true,
              mode: 1,
            },
            list: [
              {
                title: "Rate (%)",
                color: colors.bitcoin,
                dataset: params.datasets[scale].yearly_inflation_rate,
              },
            ],
          });
        },
      },

      // For scale === "height"
      // block_size,
      // block_weight,
      // block_vbytes,
      // block_interval,
    ],
  } satisfies PartialPresetFolder;
}
