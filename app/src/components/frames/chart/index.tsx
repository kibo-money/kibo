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
        "frame flex size-full min-h-0 flex-1 flex-col",
      ])}
      style={{
        display: (hide ? hide() : false) ? "none" : undefined,
      }}
    >
      <Title presets={presets} />

      <div class="border-t" />

      <Legend legend={legend} scale={scale} activeIds={activeIds} dark={dark} />

      <div class="!mt-4 flex min-h-0 flex-1 flex-col">
        <div class="relative -ml-6 -mr-8 flex min-h-0 flex-1 flex-col pb-2">
          <div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 w-full flex-none bg-gradient-to-t from-transparent to-[var(--background-color)]" />
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
          <div class="pointer-events-none absolute bottom-9 right-0 z-10 h-6 w-[80px] flex-none bg-gradient-to-b from-transparent to-[var(--background-color)]" />
          <div class="pointer-events-none absolute inset-y-0 left-0 z-10 h-full w-6 flex-none bg-gradient-to-r from-[var(--background-color)] from-5% to-transparent" />
        </div>

        <TimeScale firstChart={firstChart} scale={scale} />
      </div>
    </div>
  );
}
