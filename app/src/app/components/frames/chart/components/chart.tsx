import { cleanChart } from "/src/scripts/lightweightCharts/chart/clean";
import { renderChart } from "/src/scripts/lightweightCharts/chart/render";

export function Chart({
  presets,
  datasets,
  legendSetter,
  activeResources,
}: {
  presets: Presets;
  datasets: Datasets;
  legendSetter: Setter<PresetLegend>;
  activeResources: Accessor<Set<ResourceDataset<any, any>>>;
}) {
  onMount(() => {
    createEffect(() => {
      const preset = presets.selected();

      untrack(() =>
        renderChart({
          datasets,
          preset,
          legendSetter,
          activeResources,
        }),
      );
    });

    onCleanup(cleanChart);
  });

  return <div id="chart" class="h-full w-full cursor-crosshair" />;
}
