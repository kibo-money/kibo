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

function lightRed(dark: Accessor<boolean>) {
  return dark() ? redTailwind[300] : redTailwind[800];
}
function red(dark: Accessor<boolean>) {
  return dark() ? redTailwind[500] : redTailwind[600];
}
function darkRed(dark: Accessor<boolean>) {
  return dark() ? redTailwind[900] : redTailwind[100];
}
function orange(dark: Accessor<boolean>) {
  return dark() ? orangeTailwind[500] : orangeTailwind[600];
}
function darkOrange(dark: Accessor<boolean>) {
  return dark() ? orangeTailwind[900] : orangeTailwind[100];
}
function amber(dark: Accessor<boolean>) {
  return dark() ? amberTailwind[500] : amberTailwind[600];
}
function darkAmber(dark: Accessor<boolean>) {
  return dark() ? amberTailwind[900] : amberTailwind[100];
}
function yellow(dark: Accessor<boolean>) {
  return dark() ? yellowTailwind[500] : yellowTailwind[600];
}
function darkYellow(dark: Accessor<boolean>) {
  return dark() ? yellowTailwind[500] : yellowTailwind[600];
}
function lime(dark: Accessor<boolean>) {
  return dark() ? limeTailwind[500] : limeTailwind[600];
}
function darkLime(dark: Accessor<boolean>) {
  return dark() ? limeTailwind[900] : limeTailwind[100];
}
function green(dark: Accessor<boolean>) {
  return dark() ? greenTailwind[500] : greenTailwind[600];
}
function darkGreen(dark: Accessor<boolean>) {
  return dark() ? greenTailwind[900] : greenTailwind[100];
}
function lightEmerald(dark: Accessor<boolean>) {
  return dark() ? emeraldTailwind[300] : emeraldTailwind[800];
}
function emerald(dark: Accessor<boolean>) {
  return dark() ? emeraldTailwind[500] : emeraldTailwind[600];
}
function darkEmerald(dark: Accessor<boolean>) {
  return dark() ? emeraldTailwind[900] : emeraldTailwind[100];
}
function teal(dark: Accessor<boolean>) {
  return dark() ? tealTailwind[500] : tealTailwind[600];
}
function darkTeal(dark: Accessor<boolean>) {
  return dark() ? tealTailwind[900] : tealTailwind[100];
}
function cyan(dark: Accessor<boolean>) {
  return dark() ? cyanTailwind[500] : cyanTailwind[600];
}
function darkCyan(dark: Accessor<boolean>) {
  return dark() ? cyanTailwind[900] : cyanTailwind[100];
}
function sky(dark: Accessor<boolean>) {
  return dark() ? skyTailwind[500] : skyTailwind[600];
}
function darkSky(dark: Accessor<boolean>) {
  return dark() ? skyTailwind[900] : skyTailwind[100];
}
function blue(dark: Accessor<boolean>) {
  return dark() ? blueTailwind[500] : blueTailwind[600];
}
function darkBlue(dark: Accessor<boolean>) {
  return dark() ? blueTailwind[900] : blueTailwind[100];
}
function indigo(dark: Accessor<boolean>) {
  return dark() ? indigoTailwind[500] : indigoTailwind[600];
}
function darkIndigo(dark: Accessor<boolean>) {
  return dark() ? indigoTailwind[900] : indigoTailwind[100];
}
function violet(dark: Accessor<boolean>) {
  return dark() ? violetTailwind[500] : violetTailwind[600];
}
function darkViolet(dark: Accessor<boolean>) {
  return dark() ? violetTailwind[900] : violetTailwind[100];
}
function purple(dark: Accessor<boolean>) {
  return dark() ? purpleTailwind[500] : purpleTailwind[600];
}
function darkPurple(dark: Accessor<boolean>) {
  return dark() ? purpleTailwind[900] : purpleTailwind[100];
}
function fuchsia(dark: Accessor<boolean>) {
  return dark() ? fuchsiaTailwind[500] : fuchsiaTailwind[600];
}
function darkFuchsia(dark: Accessor<boolean>) {
  return dark() ? fuchsiaTailwind[900] : fuchsiaTailwind[100];
}
function pink(dark: Accessor<boolean>) {
  return dark() ? pinkTailwind[500] : pinkTailwind[600];
}
function darkPink(dark: Accessor<boolean>) {
  return dark() ? pinkTailwind[900] : pinkTailwind[100];
}
function rose(dark: Accessor<boolean>) {
  return dark() ? roseTailwind[500] : roseTailwind[600];
}
function darkRose(dark: Accessor<boolean>) {
  return dark() ? roseTailwind[900] : roseTailwind[100];
}

function darkWhite(dark: Accessor<boolean>) {
  return dark() ? grayTailwind[400] : grayTailwind[400];
}
function gray(dark: Accessor<boolean>) {
  return dark() ? grayTailwind[600] : grayTailwind[400];
}

function white(dark: Accessor<boolean>) {
  return dark() ? "#ffffff" : "#000000";
}

function black(dark: Accessor<boolean>) {
  return dark() ? "#000000" : "#ffffff";
}

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
  black,
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
