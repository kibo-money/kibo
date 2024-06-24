import { classPropToString } from "/src/solid/classes";
import { createRWS } from "/src/solid/rws";

import { Box } from "../box";
import { Actions } from "./components/actions";
import { Chart } from "./components/chart";
import { Legend } from "./components/legend";
import { TimeScale } from "./components/timeScale";
import { Title } from "./components/title";

export function ChartFrame({
  presets,
  datasets,
  activeResources,
  hide,
  qrcode,
  standalone,
  fullscreen,
}: {
  presets: Presets;
  hide?: Accessor<boolean>;
  qrcode: RWS<string>;
  activeResources: Accessor<Set<ResourceDataset<any, any>>>;
  datasets: Datasets;
  fullscreen?: RWS<boolean>;
  standalone: boolean;
}) {
  const legend = createRWS<PresetLegend>([]);

  return (
    <div
      class={classPropToString([
        standalone &&
          "rounded-2xl border border-orange-200/15 bg-gradient-to-b from-orange-100/5 to-black/10 to-80%",
        "flex size-full min-h-0 flex-1 flex-col overflow-hidden",
      ])}
      style={{
        display: (hide ? !hide() : true) ? undefined : "none",
      }}
    >
      <Box flex={false} dark classes="short:hidden">
        <Title presets={presets} />

        <div class="-mx-2 border-t border-orange-200/15" />

        <div class="flex pt-1.5">
          <Legend legend={legend} />

          <div class="-my-1.5 border-l border-orange-200/15 pr-1.5" />

          <Actions presets={presets} qrcode={qrcode} fullscreen={fullscreen} />
        </div>
      </Box>

      <div class="-mt-2 min-h-0 flex-1">
        <Chart
          activeResources={activeResources}
          datasets={datasets}
          // fetchedDatasets={fetchedDatasets}
          legendSetter={legend.set}
          presets={presets}
        />
      </div>

      <TimeScale />
    </div>
  );
}
