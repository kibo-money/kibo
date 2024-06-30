import { colors } from "../../utils/colors";
import { applySeriesList } from "../apply";

export function createPresets(scale: ResourceScale) {
  return {
    name: "Transactions",
    tree: [
      {
        scale,
        icon: IconTablerHandThreeFingers,
        name: "Count",
        title: "Transaction Count",
        description: "",
        applyPreset(params) {
          return applySeriesList({
            ...params,
            bottom: [
              {
                title: "1M SMA",
                color: colors.momentumYellow,
                dataset: params.datasets[scale].transaction_count_1m_sma,
              },
              {
                title: "1W SMA",
                color: colors.bitcoin,
                dataset: params.datasets[scale].transaction_count_1w_sma,
              },
              {
                title: "Raw",
                color: colors.darkBitcoin,
                dataset: params.datasets[scale].transaction_count,
              },
            ],
          });
        },
      },

      {
        name: "Volume",
        tree: [
          {
            scale,
            icon: IconTablerCoinBitcoin,
            name: "In Bitcoin",
            title: "Transaction Volume",
            description: "",
            applyPreset(params) {
              return applySeriesList({
                ...params,
                bottom: [
                  {
                    title: "1M SMA",
                    color: colors.momentumYellow,
                    dataset: params.datasets[scale].transaction_volume_1m_sma,
                  },
                  {
                    title: "1W SMA",
                    color: colors.bitcoin,
                    dataset: params.datasets[scale].transaction_volume_1w_sma,
                  },
                  {
                    title: "Raw",
                    color: colors.darkBitcoin,
                    dataset: params.datasets[scale].transaction_volume,
                  },
                ],
              });
            },
          },
          {
            scale,
            icon: IconTablerCoin,
            name: "In Dollars",
            title: "Transaction Volume In Dollars",
            description: "",
            applyPreset(params) {
              return applySeriesList({
                ...params,
                priceScaleOptions: {
                  mode: 1,
                },
                bottom: [
                  {
                    title: "1M SMA",
                    color: colors.lightDollars,
                    dataset:
                      params.datasets[scale]
                        .transaction_volume_in_dollars_1m_sma,
                  },
                  {
                    title: "1W SMA",
                    color: colors.dollars,
                    dataset:
                      params.datasets[scale]
                        .transaction_volume_in_dollars_1w_sma,
                  },
                  {
                    title: "Raw",
                    color: colors.darkDollars,
                    dataset:
                      params.datasets[scale].transaction_volume_in_dollars,
                  },
                ],
              });
            },
          },
        ],
      },

      {
        name: "Annualized Volume",
        tree: [
          {
            scale,
            icon: IconTablerCoinBitcoin,
            name: "In Bitcoin",
            title: "Annualized Transaction Volume",
            description: "",
            applyPreset(params) {
              return applySeriesList({
                ...params,
                bottom: [
                  {
                    title: "Volume",
                    color: colors.bitcoin,
                    dataset:
                      params.datasets[scale].annualized_transaction_volume,
                  },
                ],
              });
            },
          },
          {
            scale,
            icon: IconTablerCoin,
            name: "In Dollars",
            title: "Annualized Transaction Volume In Dollars",
            description: "",
            applyPreset(params) {
              return applySeriesList({
                ...params,
                bottom: [
                  {
                    title: "Volume",
                    color: colors.dollars,
                    dataset:
                      params.datasets[scale]
                        .annualized_transaction_volume_in_dollars,
                  },
                ],
              });
            },
          },
        ],
      },
      {
        scale,
        icon: IconTablerWind,
        name: "Velocity",
        title: "Transactions Velocity",
        description: "",
        applyPreset(params) {
          return applySeriesList({
            ...params,
            bottom: [
              {
                title: "Transactions Velocity",
                color: colors.bitcoin,
                dataset: params.datasets[scale].transaction_velocity,
              },
            ],
          });
        },
      },
      {
        scale,
        icon: IconTablerAlarm,
        name: "Per Second",
        title: "Transactions Per Second",
        description: "",
        applyPreset(params) {
          return applySeriesList({
            ...params,
            bottom: [
              {
                title: "1M SMA",
                color: colors.lightBitcoin,
                dataset: params.datasets[scale].transactions_per_second_1m_sma,
              },
              {
                title: "1W SMA",
                color: colors.bitcoin,
                dataset: params.datasets[scale].transactions_per_second_1w_sma,
              },
              {
                title: "Raw",
                color: colors.darkBitcoin,
                dataset: params.datasets[scale].transactions_per_second,
              },
            ],
          });
        },
      },
    ],
  } satisfies PartialPresetFolder;
}
