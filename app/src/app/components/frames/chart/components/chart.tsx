export function Chart({
  charts,
  parentDiv,
  presets,
  datasets,
  legendSetter,
  activeResources,
}: {
  charts: RWS<IChartApi[]>;
  parentDiv: RWS<HTMLDivElement | undefined>;
  presets: Presets;
  datasets: Datasets;
  legendSetter: Setter<PresetLegend>;
  activeResources: Accessor<Set<ResourceDataset<any, any>>>;
}) {
  onMount(() => {
    createEffect(() => {
      const preset = presets.selected();
      const div = parentDiv();

      if (!div) return;

      untrack(() => {
        try {
          console.log(`preset: ${preset.id}`);
          preset.applyPreset({
            charts,
            parentDiv: div,
            datasets,
            preset,
            activeResources,
            legendSetter,
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
