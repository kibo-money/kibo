// import { PriceScaleMode } from "lightweight-charts";

// import {
//   applyMultipleSeries,
//   colors,
//   PRICE_SCALE_MOMENTUM_ID,
//   SeriesType,
// } from "/src/scripts";

// // type HeightMomentumKey =
// //   | `${AnyPossibleCohortKey}SupplyPNL%Self`
// //   | `${AnyPossibleCohortKey}RealizedPriceRatio`
// //   | "activePriceRatio"
// //   | "vaultedPriceRatio"
// //   | "trueMarketMeanRatio";

// // type DateMomentumKey = HeightMomentumKey | `price${AverageName}MARatio`;

// export function createMomentumPresetFolder<
//   Scale extends ResourceScale,
//   Key extends string,
// >({
//   datasets,
//   scale,
//   id,
//   title,
//   datasetKey,
// }: {
//   datasets: Record<`${Key}${MomentumKey}`, Dataset<ResourceScale>>;
//   scale: Scale;
//   id: string;
//   title: string;
//   datasetKey: Key;
// }): PartialPresetFolder {
//   return {
//     id: `${scale}-${id}-momentum`,
//     name: "Momentum",
//     tree: [
//       {
//         id: `${scale}-${id}-momentum-value`,
//         name: "Value",
//         title: `${title} Momentum`,
//         icon: () => IconTablerRollercoaster,
//         applyPreset(params) {
//           return applyMultipleSeries({
//             scale,
//             ...params,
//             list: [
//               {
//                 title: "Momentum",
//                 colors: colors.momentum,
//                 seriesType: SeriesType.Histogram,
//                 dataset: datasets[`${datasetKey}Momentum`],
//                 options: {
//                   priceScaleId: PRICE_SCALE_MOMENTUM_ID,
//                   lastValueVisible: false,
//                 },
//               },
//             ],
//           });
//         },
//         description: "",
//       },
//       {
//         id: `${scale}-${id}-momentum-buy-low-sell-high`,
//         name: "BLSH - Buy Low Sell High",
//         tree: [
//           {
//             id: `${scale}-${id}-buy-low-sell-high-bitcoin-returns`,
//             name: "Bitcoin Returns",
//             title: `${title} Momentum Based Buy Low Sell High Bitcoin Returns`,
//             icon: () => IconTablerReceiptBitcoin,
//             applyPreset(params) {
//               return applyMultipleSeries({
//                 scale,
//                 ...params,
//                 priceScaleOptions: {
//                   halved: true,
//                   mode: PriceScaleMode.Percentage,
//                 },
//                 list: [
//                   {
//                     title: "Bitcoin Returns",
//                     dataset:
//                       datasets[`${datasetKey}MomentumBLSHBitcoinReturns`],
//                     color: colors.bitcoin,
//                   },
//                 ],
//               });
//             },
//             description: "",
//           },
//           {
//             id: `${scale}-${id}-momentum-buy-low-sell-high-dollar-returns`,
//             name: "Dollar Returns",
//             title: `${title} Momentum Based Buy Low Sell High Dollar Returns`,
//             icon: () => IconTablerReceiptDollar,
//             applyPreset(params) {
//               return applyMultipleSeries({
//                 scale,
//                 ...params,
//                 priceScaleOptions: {
//                   halved: true,
//                   mode: PriceScaleMode.Percentage,
//                 },
//                 list: [
//                   {
//                     title: "Dollar Returns",
//                     dataset: datasets[`${datasetKey}MomentumBLSHDollarReturns`],
//                     color: colors.dollars,
//                   },
//                 ],
//               });
//             },
//             description: "",
//           },
//         ],
//       },
//     ],
//   };
// }
