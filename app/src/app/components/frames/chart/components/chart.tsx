import { createRWS } from "/src/solid/rws";

export function Chart({
  charts,
  parentDiv,
  presets,
  datasets,
  legendSetter,
  dark,
  activeIds,
}: {
  charts: RWS<IChartApi[]>;
  parentDiv: RWS<HTMLDivElement | undefined>;
  presets: Presets;
  datasets: Datasets;
  legendSetter: Setter<SeriesLegend[]>;
  dark: Accessor<boolean>;
  activeIds: RWS<number[]>;
}) {
  const wasIdle = createRWS(false);

  if ("requestIdleCallback" in window) {
    const idleCallback = requestIdleCallback(() => {
      console.log("idle");
      wasIdle.set(true);
      cancelIdleCallback(idleCallback);
    });

    onCleanup(() => {
      cancelIdleCallback(idleCallback);
    });
  } else {
    const timeout = setTimeout(() => {
      console.log("timeout");
      wasIdle.set(true);
    }, 500);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  }

  onMount(() => {
    createEffect(() => {
      const preset = presets.selected();
      const div = parentDiv();

      if (!wasIdle() || !div) return;

      untrack(() => {
        try {
          console.log(`preset: ${preset.id}`);
          preset.applyPreset({
            charts,
            parentDiv: div,
            datasets,
            preset,
            legendSetter,
            dark,
            activeIds,
          });
        } catch (error) {
          console.error("chart: render: failed", error);
        }
      });
    });

    onCleanup(() =>
      charts.set((charts) => {
        charts.forEach((chart) => {
          chart.remove();
        });

        return [];
      }),
    );
  });

  return <></>;
}
