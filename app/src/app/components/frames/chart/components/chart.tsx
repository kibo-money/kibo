import { requestIdleCallbackPossible } from "/src/env";
import { applySeriesList } from "/src/scripts/presets/apply";
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

  if (requestIdleCallbackPossible) {
    const idleCallback = requestIdleCallback(() => {
      wasIdle.set(true);
    });

    onCleanup(() => {
      cancelIdleCallback(idleCallback);
    });
  } else {
    const timeout = setTimeout(() => {
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
          applySeriesList({
            charts,
            parentDiv: div,
            datasets,
            preset,
            legendSetter,
            dark,
            activeIds,
            priceScaleOptions: preset.priceScaleOptions,
            top: preset.top,
            bottom: preset.bottom,
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
