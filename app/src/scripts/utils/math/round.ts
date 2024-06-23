export const roundValue = (value: number, decimals = 5) => {
  const tenPowerX = 10 ** decimals;
  return Math.round(value * tenPowerX) / tenPowerX;
};
