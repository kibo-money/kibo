import { colors } from "../../utils/colors";
import { applySeriesList } from "../apply";
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
        applyPreset(params) {
          return applySeriesList(params);
        },
        description: "",
      },
      {
        scale,
        icon: IconTablerInfinity,
        name: "Capitalization",
        title: "Market Capitalization",
        applyPreset(params) {
          return applySeriesList({
            ...params,
            bottom: [
              {
                title: "Market Cap.",
                dataset: params.datasets[scale].market_cap,
                color: colors.bitcoin,
              },
            ],
          });
        },
        description: "",
      },
      ...(scale === "date"
        ? ([
            createAveragesPresets(),
            createReturnsPresets(),
            createIndicatorsPresets(),
          ] satisfies PartialPresetTree)
        : []),
    ],
  } satisfies PartialPresetFolder;
}
