import { colors } from "../../utils/colors";

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
        unit: "Count",
        bottom: [
          {
            title: "1M SMA",
            color: colors.momentumYellow,
            datasetPath: `/${scale}-to-transaction-count-1m-sma`,
          },
          {
            title: "1W SMA",
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-transaction-count-1w-sma`,
          },
          {
            title: "Raw",
            color: colors.darkBitcoin,
            datasetPath: `/${scale}-to-transaction-count`,
          },
        ],
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
            unit: "Bitcoin",
            bottom: [
              {
                title: "1M SMA",
                color: colors.momentumYellow,
                datasetPath: `/${scale}-to-transaction-volume-1m-sma`,
              },
              {
                title: "1W SMA",
                color: colors.bitcoin,
                datasetPath: `/${scale}-to-transaction-volume-1w-sma`,
              },
              {
                title: "Raw",
                color: colors.darkBitcoin,
                datasetPath: `/${scale}-to-transaction-volume`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerCoin,
            name: "In Dollars",
            title: "Transaction Volume In Dollars",
            description: "",
            unit: "US Dollars",
            bottom: [
              {
                title: "1M SMA",
                color: colors.lightDollars,
                datasetPath: `/${scale}-to-transaction-volume-in-dollars-1m-sma`,
              },
              {
                title: "1W SMA",
                color: colors.dollars,
                datasetPath: `/${scale}-to-transaction-volume-in-dollars-1w-sma`,
              },
              {
                title: "Raw",
                color: colors.darkDollars,
                datasetPath: `/${scale}-to-transaction-volume-in-dollars`,
              },
            ],
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
            unit: "Bitcoin",
            bottom: [
              {
                title: "Volume",
                color: colors.bitcoin,
                datasetPath: `/${scale}-to-annualized-transaction-volume`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerCoin,
            name: "In Dollars",
            title: "Annualized Transaction Volume In Dollars",
            description: "",
            unit: "US Dollars",
            bottom: [
              {
                title: "Volume",
                color: colors.dollars,
                datasetPath: `/${scale}-to-annualized-transaction-volume-in-dollars`,
              },
            ],
          },
        ],
      },
      {
        scale,
        icon: IconTablerWind,
        name: "Velocity",
        title: "Transactions Velocity",
        description: "",
        unit: "",
        bottom: [
          {
            title: "Transactions Velocity",
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-transaction-velocity`,
          },
        ],
      },
      {
        scale,
        icon: IconTablerAlarm,
        name: "Per Second",
        title: "Transactions Per Second",
        description: "",
        unit: "Transactions",
        bottom: [
          {
            title: "1M SMA",
            color: colors.lightBitcoin,
            datasetPath: `/${scale}-to-transactions-per-second-1m-sma`,
          },
          {
            title: "1W SMA",
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-transactions-per-second-1w-sma`,
          },
          {
            title: "Raw",
            color: colors.darkBitcoin,
            datasetPath: `/${scale}-to-transactions-per-second`,
          },
        ],
      },
    ],
  } satisfies PartialPresetFolder;
}
