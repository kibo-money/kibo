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

  const charts = createRWS<IChartApi[]>([]);

  const div = createRWS<HTMLDivElement | undefined>(undefined);

  const Chart = lazy(() =>
    import("./components/chart").then((d) => ({ default: d.Chart })),
  );

  return (
    <div
      class={classPropToString([
        standalone &&
          "border-lighter rounded-2xl border bg-gradient-to-b from-white/15 to-white/30 to-80% shadow-md dark:from-orange-100/5 dark:to-black/10",
        "flex size-full min-h-0 flex-1 flex-col overflow-hidden",
      ])}
      style={{
        display: (hide ? hide() : false) ? "none" : undefined,
      }}
    >
      <Box flex={false} dark padded={false} classes="short:hidden">
        <Title presets={presets} />

        <div class="border-lighter border-t" />

        <div class="flex">
          <Legend legend={legend} />

          <div class="border-lighter border-l" />

          <Actions presets={presets} qrcode={qrcode} fullscreen={fullscreen} />
        </div>
      </Box>

      <div ref={div.set} class="-mr-2 -mt-2 flex min-h-0 flex-1 flex-col">
        <Chart
          parentDiv={div}
          charts={charts}
          activeResources={activeResources}
          datasets={datasets}
          legendSetter={legend.set}
          presets={presets}
        />
      </div>

      <TimeScale charts={charts} />
    </div>
  );
}
