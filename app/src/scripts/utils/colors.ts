import {
  amber as amberTailwind,
  blue as blueTailwind,
  cyan as cyanTailwind,
  emerald as emeraldTailwind,
  fuchsia as fuchsiaTailwind,
  neutral as grayTailwind,
  green as greenTailwind,
  indigo as indigoTailwind,
  lime as limeTailwind,
  orange as orangeTailwind,
  pink as pinkTailwind,
  purple as purpleTailwind,
  red as redTailwind,
  rose as roseTailwind,
  sky as skyTailwind,
  teal as tealTailwind,
  violet as violetTailwind,
  yellow as yellowTailwind,
} from "tailwindcss/colors";

// ---
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// DO NOT USE TRANSPARENCY HERE
// ---

const lightRed = redTailwind[300];
const red = redTailwind[500];
const darkRed = redTailwind[900];
const orange = orangeTailwind[500];
const darkOrange = orangeTailwind[900];
const amber = amberTailwind[500];
const darkAmber = amberTailwind[900];
const yellow = yellowTailwind[500];
const darkYellow = yellowTailwind[500];
const lime = limeTailwind[500];
const darkLime = limeTailwind[900];
const green = greenTailwind[500];
const darkGreen = greenTailwind[900];
const lightEmerald = emeraldTailwind[300];
const emerald = emeraldTailwind[500];
const darkEmerald = emeraldTailwind[900];
const teal = tealTailwind[500];
const darkTeal = tealTailwind[900];
const cyan = cyanTailwind[500];
const darkCyan = cyanTailwind[900];
const sky = skyTailwind[500];
const darkSky = skyTailwind[900];
const blue = blueTailwind[500];
const darkBlue = blueTailwind[900];
const indigo = indigoTailwind[500];
const darkIndigo = indigoTailwind[900];
const violet = violetTailwind[500];
const darkViolet = violetTailwind[900];
const purple = purpleTailwind[500];
const darkPurple = purpleTailwind[900];
const fuchsia = fuchsiaTailwind[500];
const darkFuchsia = fuchsiaTailwind[900];
const pink = pinkTailwind[500];
const darkPink = pinkTailwind[900];
const rose = roseTailwind[500];
const darkRose = roseTailwind[900];

const darkWhite = grayTailwind[400];
const gray = grayTailwind[600];

const black = "#000000";
const white = "#ffffff";

export const convertCandleToCandleColor = (
  candle: { close: number; open: number },
  inverse?: boolean,
) =>
  (candle.close || 1) > (candle.open || 0)
    ? !inverse
      ? green
      : red
    : !inverse
      ? red
      : green;

export const convertCandleToVolumeColor = (
  candle: { close: number; open: number },
  inverse?: boolean,
) =>
  (candle.close || 1) > (candle.open || 0)
    ? !inverse
      ? darkGreen
      : darkRed
    : !inverse
      ? darkRed
      : darkGreen;

export const colors = {
  white,
  darkWhite,
  gray,
  lightBitcoin: yellow,
  bitcoin: orange,
  darkBitcoin: darkOrange,
  lightDollars: lime,
  dollars: emerald,
  darkDollars: darkEmerald,

  _1d: lightRed,
  _1w: red,
  _8d: orange,
  _13d: amber,
  _21d: yellow,
  _1m: lime,
  _34d: green,
  _55d: emerald,
  _89d: teal,
  _144d: cyan,
  _6m: sky,
  _1y: blue,
  _2y: indigo,
  _200w: violet,
  _4y: purple,
  _10y: fuchsia,

  p2pk: lime,
  p2pkh: violet,
  p2sh: emerald,
  p2wpkh: cyan,
  p2wsh: pink,
  p2tr: blue,
  crab: red,
  fish: lime,
  humpback: violet,
  plankton: emerald,
  shark: cyan,
  shrimp: pink,
  whale: blue,
  megalodon: purple,
  realizedPrice: orange,
  oneMonthHolders: cyan,
  threeMonthsHolders: lime,
  sth: yellow,
  sixMonthsHolder: red,
  oneYearHolders: pink,
  twoYearsHolders: purple,
  lth: fuchsia,
  balancedPrice: yellow,
  cointimePrice: yellow,
  trueMarketMeanPrice: blue,
  vaultedPrice: green,
  cvdd: lime,
  terminalPrice: red,
  loss: red,
  darkLoss: darkRed,
  profit: green,
  darkProfit: darkGreen,
  thermoCap: green,
  investorCap: rose,
  realizedCap: orange,
  ethereum: indigo,
  usdt: emerald,
  usdc: blue,
  ust: red,
  busd: yellow,
  usdd: emerald,
  frax: gray,
  dai: amber,
  tusd: indigo,
  pyusd: blue,
  darkLiveliness: darkRose,
  liveliness: rose,
  vaultedness: green,
  activityToVaultednessRatio: violet,
  up_to_1d: lightRed,
  up_to_1w: red,
  up_to_1m: orange,
  up_to_2m: orange,
  up_to_3m: orange,
  up_to_4m: orange,
  up_to_5m: orange,
  up_to_6m: orange,
  up_to_1y: orange,
  up_to_2y: orange,
  up_to_3y: orange,
  up_to_4y: orange,
  up_to_5y: orange,
  up_to_7y: orange,
  up_to_10y: orange,
  up_to_15y: orange,
  from_10y_to_15y: purple,
  from_7y_to_10y: violet,
  from_5y_to_7y: indigo,
  from_3y_to_5y: sky,
  from_2y_to_3y: teal,
  from_1y_to_2y: green,
  from_6m_to_1y: lime,
  from_3m_to_6m: yellow,
  from_1m_to_3m: amber,
  from_1w_to_1m: orange,
  from_1d_to_1w: red,
  from_1y: green,
  from_2y: teal,
  from_4y: indigo,
  from_10y: violet,
  from_15y: fuchsia,
  coinblocksCreated: purple,
  coinblocksDestroyed: red,
  coinblocksStored: green,
  momentum: [green, yellow, red],
  momentumGreen: green,
  momentumYellow: yellow,
  momentumRed: red,
  extremeMax: red,
  extremeMiddle: orange,
  extremeMin: yellow,
  year_2009: yellow,
  year_2010: yellow,
  year_2011: yellow,
  year_2012: yellow,
  year_2013: yellow,
  year_2014: yellow,
  year_2015: yellow,
  year_2016: yellow,
  year_2017: yellow,
  year_2018: yellow,
  year_2019: yellow,
  year_2020: yellow,
  year_2021: yellow,
  year_2022: yellow,
  year_2023: yellow,
  year_2024: yellow,
};
