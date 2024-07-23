import { classPropToString } from "/src/solid/classes";
import { createWasIdleAccessor } from "/src/solid/idle";
import { createRWS } from "/src/solid/rws";

import { Box } from "../box";
import { Actions } from "./components/actions";
import { Legend } from "./components/legend";
import { TimeScale } from "./components/timeScale";
import { Title } from "./components/title";

export function ChartFrame({
  presets,
  datasets,
  hide,
  qrcode,
  standalone,
  fullscreen,
  dark,
}: {
  presets: Presets;
  hide?: Accessor<boolean>;
  qrcode: RWS<string>;
  datasets: Datasets;
  fullscreen?: RWS<boolean>;
  dark: Accessor<boolean>;
  standalone: boolean;
}) {
  const legend = createRWS<SeriesLegend[]>([], { equals: false });

  const firstChart = createRWS<IChartApi | undefined>(undefined);

  const scale = createMemo(() => presets.selected().scale);

  const activeIds = createRWS([] as number[], { equals: false });

  const wasIdle = createWasIdleAccessor();

  const Charts = lazy(() =>
    import("./components/charts").then((d) => ({ default: d.Charts })),
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
      <Box
        flex={false}
        dark
        padded={false}
        spaced={false}
        classes="short:hidden"
      >
        <Title presets={presets} />

        <div class="border-lighter border-t" />

        <div class="flex">
          <Legend
            legend={legend}
            scale={scale}
            activeIds={activeIds}
            dark={dark}
          />

          <div class="border-lighter border-l" />

          <Actions presets={presets} qrcode={qrcode} fullscreen={fullscreen} />
        </div>
      </Box>

      <div class="-mr-2 -mt-2 flex min-h-0 flex-1 flex-col">
        <Show when={wasIdle()}>
          <Charts
            firstChartSetter={firstChart.set}
            datasets={datasets}
            legendSetter={legend.set}
            preset={presets.selected}
            dark={dark}
            activeIds={activeIds}
          />
        </Show>
      </div>

      <TimeScale firstChart={firstChart} scale={scale} />
    </div>
  );
}
