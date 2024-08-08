import { colors } from "../../utils/colors";
import { createPresets as createAveragesPresets } from "./averages";
import { createPresets as createIndicatorsPresets } from "./indicators";
import { createPresets as createReturnsPresets } from "./returns";

export function createPresets(scale: ResourceScale) {
  return {
    name: "Market",
    tree: [
      {
        scale,
        icon: IconTablerCurrencyDollar,
        name: "Price",
        title: "Market Price",
        description: "",
        unit: "US Dollars",
      },
      {
        scale,
        icon: IconTablerInfinity,
        name: "Capitalization",
        title: "Market Capitalization",
        description: "",
        unit: "US Dollars",
        bottom: [
          {
            title: "Market Cap.",
            datasetPath: `${scale}-to-market-cap`,
            color: colors.bitcoin,
          },
        ],
      },
      createAveragesPresets(scale),
      ...(scale === "date"
        ? ([
            createReturnsPresets(),
            createIndicatorsPresets(),
          ] satisfies PartialPresetTree)
        : []),
    ],
  } satisfies PartialPresetFolder;
}
