const suffices = ["M", "B", "T", "Q"];

export function valueToString(value: number) {
  const absoluteValue = Math.abs(value);

  // value = absoluteValue;

  if (isNaN(value)) {
    return "";
    // } else if (value === 0) {
    //   return "0";
  } else if (absoluteValue < 10) {
    return numberToUSLocale(value, 3);
  } else if (absoluteValue < 100) {
    return numberToUSLocale(value, 2);
  } else if (absoluteValue < 1_000) {
    return numberToUSLocale(value, 1);
  } else if (absoluteValue < 100_000) {
    return numberToUSLocale(value, 0);
  } else if (absoluteValue < 1_000_000) {
    return `${numberToUSLocale(value / 1_000, 1)}K`;
  } else if (absoluteValue >= 1_000_000_000_000_000_000) {
    return "Inf.";
  }

  const log = Math.floor(Math.log10(absoluteValue) - 6);

  const letterIndex = Math.floor(log / 3);
  const letter = suffices[letterIndex];

  const modulused = log % 3;

  if (modulused === 0) {
    return `${numberToUSLocale(value / (1_000_000 * 1_000 ** letterIndex), 3)}${letter}`;
  } else if (modulused === 1) {
    return `${numberToUSLocale(value / (1_000_000 * 1_000 ** letterIndex), 2)}${letter}`;
  } else {
    return `${numberToUSLocale(value / (1_000_000 * 1_000 ** letterIndex), 1)}${letter}`;
  }
}

function numberToUSLocale(
  value: number,
  digits?: number,
  options?: Intl.NumberFormatOptions | undefined,
) {
  return value.toLocaleString("en-us", {
    ...options,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
