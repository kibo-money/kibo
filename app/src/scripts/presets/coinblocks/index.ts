import { colors } from "../../utils/colors";
import { SeriesType } from "../enums";

export function createPresets(scale: ResourceScale) {
  return {
    name: "Cointime Economics",
    tree: [
      {
        name: "Prices",
        tree: [
          {
            scale,
            icon: IconTablerArrowsCross,
            name: "All",
            title: "All Cointime Prices",
            description: "",
            top: [
              {
                title: "Vaulted Price",
                color: colors.vaultedness,
                datasetPath: `/${scale}-to-vaulted-price`,
              },
              {
                title: "Active Price",
                color: colors.liveliness,
                datasetPath: `/${scale}-to-active-price`,
              },
              {
                title: "True Market Mean",
                color: colors.trueMarketMeanPrice,
                datasetPath: `/${scale}-to-true-market-mean`,
              },
              {
                title: "Realized Price",
                color: colors.bitcoin,
                datasetPath: `/${scale}-to-realized-price`,
              },
              {
                title: "Cointime",
                color: colors.cointimePrice,
                datasetPath: `/${scale}-to-cointime-price`,
              },
            ],
          },
          {
            name: "Active",
            tree: [
              {
                scale,
                icon: IconTablerHeartBolt,
                name: "Price",
                title: "Active Price",
                description: "",
                top: [
                  {
                    title: "Active Price",
                    color: colors.liveliness,
                    datasetPath: `/${scale}-to-active-price`,
                  },
                ],
              },
            ],
          },
          {
            name: "Vaulted",
            tree: [
              {
                scale,
                icon: IconTablerBuildingBank,
                name: "Price",
                title: "Vaulted Price",
                description: "",
                top: [
                  {
                    title: "Vaulted Price",
                    color: colors.vaultedness,
                    datasetPath: `/${scale}-to-vaulted-price`,
                  },
                ],
              },
            ],
          },
          {
            name: "True Market Mean",
            tree: [
              {
                scale,
                icon: IconTablerStackMiddle,
                name: "Price",
                title: "True Market Mean",
                description: "",
                top: [
                  {
                    title: "True Market Mean",
                    color: colors.trueMarketMeanPrice,
                    datasetPath: `/${scale}-to-true-market-mean`,
                  },
                ],
              },
            ],
          },
          {
            name: "Cointime Price",
            tree: [
              {
                scale,
                icon: IconTablerStackMiddle,
                name: "Price",
                title: "Cointime Price",
                description: "",
                top: [
                  {
                    title: "Cointime",
                    color: colors.cointimePrice,
                    datasetPath: `/${scale}-to-cointime-price`,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Capitalizations",
        tree: [
          {
            scale,
            icon: IconTablerArrowsCross,
            name: "All",
            title: "Cointime Capitalizations",
            description: "",
            priceScaleOptions: {
              mode: 1,
            },
            bottom: [
              {
                title: "Market Cap",
                color: colors.white,
                datasetPath: `/${scale}-to-market-cap`,
              },
              {
                title: "Realized Cap",
                color: colors.realizedCap,
                datasetPath: `/${scale}-to-realized-cap`,
              },
              {
                title: "Investor Cap",
                color: colors.investorCap,
                datasetPath: `/${scale}-to-investor-cap`,
              },
              {
                title: "Thermo Cap",
                color: colors.thermoCap,
                datasetPath: `/${scale}-to-thermo-cap`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerPick,
            name: "Thermo Cap",
            title: "Thermo Cap",
            description: "",
            priceScaleOptions: {
              mode: 1,
            },
            bottom: [
              {
                title: "Thermo Cap",
                color: colors.thermoCap,
                datasetPath: `/${scale}-to-thermo-cap`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerTie,
            name: "Investor Cap",
            title: "Investor Cap",
            description: "",

            priceScaleOptions: {
              mode: 1,
            },
            bottom: [
              {
                title: "Investor Cap",
                color: colors.investorCap,
                datasetPath: `/${scale}-to-investor-cap`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerDivide,
            name: "Thermo Cap To Investor Cap Ratio",
            title: "Thermo Cap To Investor Cap Ratio (%)",
            description: "",
            bottom: [
              {
                title: "Ratio",
                color: colors.bitcoin,
                datasetPath: `/${scale}-to-thermo-cap-to-investor-cap-ratio`,
              },
            ],
          },
        ],
      },
      {
        name: "Coinblocks",
        tree: [
          {
            scale,
            icon: IconTablerArrowsCross,
            name: "All",
            title: "All Coinblocks",
            description: "",
            bottom: [
              {
                title: "Coinblocks Created",
                color: colors.coinblocksCreated,
                datasetPath: `/${scale}-to-coinblocks-created`,
              },
              {
                title: "Coinblocks Destroyed",
                color: colors.coinblocksDestroyed,
                datasetPath: `/${scale}-to-coinblocks-destroyed`,
              },
              {
                title: "Coinblocks Stored",
                color: colors.coinblocksStored,
                datasetPath: `/${scale}-to-coinblocks-stored`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerCube,
            name: "Created",
            title: "Coinblocks Created",
            description: "",
            bottom: [
              {
                title: "Coinblocks Created",
                color: colors.coinblocksCreated,
                datasetPath: `/${scale}-to-coinblocks-created`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerFileShredder,
            name: "Destroyed",
            title: "Coinblocks Destroyed",
            description: "",

            bottom: [
              {
                title: "Coinblocks Destroyed",
                color: colors.coinblocksDestroyed,
                datasetPath: `/${scale}-to-coinblocks-destroyed`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerBuildingWarehouse,
            name: "Stored",
            title: "Coinblocks Stored",
            description: "",
            bottom: [
              {
                title: "Coinblocks Stored",
                color: colors.coinblocksStored,
                datasetPath: `/${scale}-to-coinblocks-stored`,
              },
            ],
          },
        ],
      },
      {
        name: "Cumulative Coinblocks",
        tree: [
          {
            scale,
            icon: IconTablerArrowsCross,
            name: "All",
            title: "All Cumulative Coinblocks",
            description: "",
            bottom: [
              {
                title: "Cumulative Coinblocks Created",
                color: colors.coinblocksCreated,
                datasetPath: `/${scale}-to-cumulative-coinblocks-created`,
              },
              {
                title: "Cumulative Coinblocks Destroyed",
                color: colors.coinblocksDestroyed,
                datasetPath: `/${scale}-to-cumulative-coinblocks-destroyed`,
              },
              {
                title: "Cumulative Coinblocks Stored",
                color: colors.coinblocksStored,
                datasetPath: `/${scale}-to-cumulative-coinblocks-stored`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerCube,
            name: "Created",
            title: "Cumulative Coinblocks Created",
            description: "",
            bottom: [
              {
                title: "Cumulative Coinblocks Created",
                color: colors.coinblocksCreated,
                datasetPath: `/${scale}-to-cumulative-coinblocks-created`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerFileShredder,
            name: "Destroyed",
            title: "Cumulative Coinblocks Destroyed",
            description: "",
            bottom: [
              {
                title: "Cumulative Coinblocks Destroyed",
                color: colors.coinblocksDestroyed,
                datasetPath: `/${scale}-to-cumulative-coinblocks-destroyed`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerBuildingWarehouse,
            name: "Stored",
            title: "Cumulative Coinblocks Stored",
            description: "",
            bottom: [
              {
                title: "Cumulative Coinblocks Stored",
                color: colors.coinblocksStored,
                datasetPath: `/${scale}-to-cumulative-coinblocks-stored`,
              },
            ],
          },
        ],
      },
      {
        name: "Liveliness & Vaultedness",
        tree: [
          {
            scale,
            icon: IconTablerHeartBolt,
            name: "Liveliness - Activity",
            title: "Liveliness (Activity)",
            description: "",
            bottom: [
              {
                title: "Liveliness",
                color: colors.liveliness,
                datasetPath: `/${scale}-to-liveliness`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerBuildingBank,
            name: "Vaultedness",
            title: "Vaultedness",
            description: "",
            bottom: [
              {
                title: "Vaultedness",
                color: colors.vaultedness,
                datasetPath: `/${scale}-to-vaultedness`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerArrowsCross,
            name: "Versus",
            title: "Liveliness V. Vaultedness",
            description: "",
            bottom: [
              {
                title: "Liveliness",
                color: colors.liveliness,
                datasetPath: `/${scale}-to-liveliness`,
              },
              {
                title: "Vaultedness",
                color: colors.vaultedness,
                datasetPath: `/${scale}-to-vaultedness`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerDivide,
            name: "Activity To Vaultedness Ratio",
            title: "Activity To Vaultedness Ratio",
            description: "",
            bottom: [
              {
                title: "Activity To Vaultedness Ratio",
                color: colors.activityToVaultednessRatio,
                datasetPath: `/${scale}-to-activity-to-vaultedness-ratio`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerHeartBolt,
            name: "Concurrent Liveliness - Supply Adjusted Coindays Destroyed",
            title: "Concurrent Liveliness - Supply Adjusted Coindays Destroyed",
            description: "",
            bottom: [
              {
                title: "Concurrent Liveliness 14d Median",
                color: colors.darkLiveliness,
                datasetPath: `/${scale}-to-concurrent-liveliness-2w-median`,
              },
              {
                title: "Concurrent Liveliness",
                color: colors.liveliness,
                datasetPath: `/${scale}-to-concurrent-liveliness`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerStairs,
            name: "Liveliness Incremental Change",
            title: "Liveliness Incremental Change",
            description: "",
            bottom: [
              {
                title: "Liveliness Incremental Change",
                color: colors.darkLiveliness,
                seriesType: SeriesType.Based,
                datasetPath: `/${scale}-to-liveliness-net-change`,
              },
              {
                title: "Liveliness Incremental Change 14 Day Median",
                color: colors.liveliness,
                seriesType: SeriesType.Based,
                datasetPath: `/${scale}-to-liveliness-net-change-2w-median`,
              },
            ],
          },
        ],
      },
      {
        name: "Supply",
        tree: [
          {
            scale,
            icon: IconTablerBuildingBank,
            name: "Vaulted",
            title: "Vaulted Supply",
            description: "",
            bottom: [
              {
                title: "Vaulted Supply",
                color: colors.vaultedness,
                datasetPath: `/${scale}-to-vaulted-supply`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerHeartBolt,
            name: "Active",
            title: "Active Supply",
            description: "",

            bottom: [
              {
                title: "Active Supply",
                color: colors.liveliness,
                datasetPath: `/${scale}-to-active-supply`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerArrowsCross,
            name: "Vaulted V. Active",
            title: "Vaulted V. Active",
            description: "",

            bottom: [
              {
                title: "Circulating Supply",
                color: colors.coinblocksCreated,
                datasetPath: `/${scale}-to-supply`,
              },
              {
                title: "Vaulted Supply",
                color: colors.vaultedness,
                datasetPath: `/${scale}-to-vaulted-supply`,
              },
              {
                title: "Active Supply",
                color: colors.liveliness,
                datasetPath: `/${scale}-to-active-supply`,
              },
            ],
          },
          // TODO: Fix, Bad data
          // {
          //   id: 'asymptomatic-supply-regions',
          //   icon: IconTablerDirections,
          //   name: 'Asymptomatic Supply Regions',
          //   title: 'Asymptomatic Supply Regions',
          //   description: '',
          //   applyPreset(params) {
          //     return applyMultipleSeries({
          //       ...params,
          //       priceScaleOptions: {
          //         halved: true,
          //       },
          //       list: [
          //         {
          //           id: 'min-vaulted',
          //           title: 'Min Vaulted Supply',
          //           color: colors.vaultedness,
          //           dataset: params.`/${scale}-to-dateToMinVaultedSupply,
          //         },
          //         {
          //           id: 'max-active',
          //           title: 'Max Active Supply',
          //           color: colors.liveliness,
          //           dataset: params.`/${scale}-to-dateToMaxActiveSupply,
          //         },
          //       ],
          //     })
          //   },
          // },
          {
            scale,
            icon: IconTablerBuildingBank,
            name: "Vaulted Net Change",
            title: "Vaulted Supply Net Change",
            description: "",
            bottom: [
              {
                title: "Vaulted Supply Net Change",
                color: colors.vaultedness,
                datasetPath: `/${scale}-to-vaulted-supply`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerHeartBolt,
            name: "Active Net Change",
            title: "Active Supply Net Change",
            description: "",
            bottom: [
              {
                title: "Active Supply Net Change",
                color: colors.liveliness,
                datasetPath: `/${scale}-to-active-supply-net-change`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerSwords,
            name: "Active VS. Vaulted 90D Net Change",
            title: "Active VS. Vaulted 90 Day Supply Net Change",
            description: "",
            bottom: [
              {
                title: "Active Supply Net Change",
                color: colors.liveliness,
                datasetPath: `/${scale}-to-active-supply-3m-net-change`,
                seriesType: SeriesType.Based,
              },
              {
                title: "Vaulted Supply Net Change",
                color: colors.vaultedPrice,
                seriesType: SeriesType.Based,
                datasetPath: `/${scale}-to-vaulted-supply-3m-net-change`,
              },
            ],
          },
          // TODO: Fix, Bad data
          // {
          //   id: 'vaulted-supply-annualized-net-change',
          //   icon: IconTablerBuildingBank,
          //   name: 'Vaulted Annualized Net Change',
          //   title: 'Vaulted Supply Annualized Net Change',
          //   description: '',
          //   applyPreset(params) {
          //     return applyMultipleSeries({
          //       ...params,
          //       priceScaleOptions: {
          //         halved: true,
          //       },
          //       list: [
          //         {
          //           id: 'vaulted-annualized-supply-net-change',
          //           title: 'Vaulted Supply Annualized Net Change',
          //           color: colors.vaultedness,
          //           dataset:
          //             `/${scale}-to-vaultedAnnualizedSupplyNetChange,
          //         },
          //       ],
          //     })
          //   },
          // },

          // TODO: Fix, Bad data
          // {
          //   id: 'vaulting-rate',
          //   icon: IconTablerBuildingBank,
          //   name: 'Vaulting Rate',
          //   title: 'Vaulting Rate',
          //   description: '',
          //   applyPreset(params) {
          //     return applyMultipleSeries({
          //       ...params,
          //       priceScaleOptions: {
          //         halved: true,
          //       },
          //       list: [
          //         {
          //           id: 'vaulting-rate',
          //           title: 'Vaulting Rate',
          //           color: colors.vaultedness,
          //           dataset: `/${scale}-to-vaultingRate,
          //         },
          //         {
          //           id: 'nominal-inflation-rate',
          //           title: 'Nominal Inflation Rate',
          //           color: colors.orange,
          //           dataset: params.`/${scale}-to-dateToYearlyInflationRate,
          //         },
          //       ],
          //     })
          //   },
          // },

          // TODO: Fix, Bad data
          // {
          //   id: 'active-supply-net-change-decomposition',
          //   icon: IconTablerArrowsCross,
          //   name: 'Active Supply Net Change Decomposition (90D)',
          //   title: 'Active Supply Net 90 Day Change Decomposition',
          //   description: '',
          //   applyPreset(params) {
          //     return applyMultipleSeries({
          //       ...params,
          //       priceScaleOptions: {
          //         halved: true,
          //       },
          //       list: [
          //         {
          //           id: 'issuance-change',
          //           title: 'Change From Issuance',
          //           color: colors.emerald,
          //           dataset:
          //             params.params.datasets[scale]
          //               [scale].activeSupplyChangeFromIssuance90dChange,
          //         },
          //         {
          //           id: 'transactions-change',
          //           title: 'Change From Transactions',
          //           color: colors.rose,
          //           dataset:
          //             params.params.datasets[scale]
          //               [scale].activeSupplyChangeFromTransactions90dChange,
          //         },
          //         // {
          //         //   id: 'active',
          //         //   title: 'Active Supply',
          //         //   color: colors.liveliness,
          //         //   dataset: `/${scale}-to-activeSupply,
          //         // },
          //       ],
          //     })
          //   },
          // },

          {
            scale,
            icon: IconTablerTrendingUp,
            name: "In Profit",
            title: "Cointime Supply In Profit",
            description: "",
            bottom: [
              {
                title: "Circulating Supply",
                color: colors.coinblocksCreated,
                datasetPath: `/${scale}-to-supply`,
              },
              {
                title: "Vaulted Supply",
                color: colors.vaultedness,
                datasetPath: `/${scale}-to-vaulted-supply`,
              },
              {
                title: "Supply in profit",
                color: colors.bitcoin,
                datasetPath: `/${scale}-to-supply-in-profit`,
              },
            ],
          },
          {
            scale,
            icon: IconTablerTrendingDown,
            name: "In Loss",
            title: "Cointime Supply In Loss",
            description: "",
            bottom: [
              {
                title: "Circulating Supply",
                color: colors.coinblocksCreated,
                datasetPath: `/${scale}-to-supply`,
              },
              {
                title: "Active Supply",
                color: colors.liveliness,
                datasetPath: `/${scale}-to-active-supply`,
              },
              {
                title: "Supply in Loss",
                color: colors.bitcoin,
                datasetPath: `/${scale}-to-supply-in-loss`,
              },
            ],
          },
        ],
      },
      {
        scale,
        icon: IconTablerBuildingFactory,
        name: "Cointime Yearly Inflation Rate",
        title: "Cointime-Adjusted Yearly Inflation Rate (%)",
        description: "",
        priceScaleOptions: {
          mode: 1,
        },
        bottom: [
          {
            title: "Cointime Adjusted",
            color: colors.coinblocksCreated,
            datasetPath: `/${scale}-to-cointime-adjusted-yearly-inflation-rate`,
          },
          {
            title: "Nominal",
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-yearly-inflation-rate`,
          },
        ],
      },
      {
        scale,
        icon: IconTablerWind,
        name: "Cointime Velocity",
        title: "Cointime-Adjusted Transactions Velocity",
        description: "",
        priceScaleOptions: {
          mode: 1,
        },
        bottom: [
          {
            title: "Cointime Adjusted",
            color: colors.coinblocksCreated,
            datasetPath: `/${scale}-to-cointime-adjusted-velocity`,
          },
          {
            title: "Nominal",
            color: colors.bitcoin,
            datasetPath: `/${scale}-to-transaction-velocity`,
          },
        ],
      },
    ],
  } satisfies PartialPresetFolder;
}
