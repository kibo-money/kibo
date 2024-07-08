import { classPropToString } from "/src/solid/classes";
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
  const legend = createRWS<SeriesLegend[]>([]);

  const charts = createRWS<IChartApi[]>([]);

  const div = createRWS<HTMLDivElement | undefined>(undefined);

  const scale = createMemo(() => presets.selected().scale);

  const activeIds = createRWS([] as number[], { equals: false });

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

      <div ref={div.set} class="-mr-2 -mt-2 flex min-h-0 flex-1 flex-col">
        <Chart
          parentDiv={div}
          charts={charts}
          datasets={datasets}
          legendSetter={legend.set}
          presets={presets}
          dark={dark}
          activeIds={activeIds}
        />
      </div>

      <TimeScale charts={charts} scale={scale} />
    </div>
  );
}
