export const priceToUSLocale = (price: number, compact = true) => {
  const absolutePrice = Math.abs(price);
  const lessThan100 = absolutePrice < 100;
  const lessThan1000 = absolutePrice < 1_000;
  const biggerThanMillion = absolutePrice >= 1_000_000;

  return numberToUSLocale(
    price,
    lessThan1000 ? (lessThan100 ? 2 : 1) : biggerThanMillion ? 3 : 0,
    biggerThanMillion && compact
      ? {
          notation: "compact",
          compactDisplay: "short",
        }
      : undefined,
  );
};

export const percentageToUSLocale = (percentage: number) =>
  numberToUSLocale(percentage, 1);

const numberToUSLocale = (
  value: number,
  digits: number,
  options?: Intl.NumberFormatOptions | undefined,
) =>
  value.toLocaleString("en-us", {
    ...options,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
