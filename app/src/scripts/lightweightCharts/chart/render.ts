import { createChart } from "./create";
import { chartState } from "./state";
import { setWhitespace } from "./whitespace";

export function renderChart({
  datasets,
  legendSetter,
  preset,
  activeResources,
}: {
  datasets: Datasets;
  legendSetter: Setter<PresetLegend>;
  preset: Preset;
  activeResources: Accessor<Set<ResourceDataset<any, any>>>;
}) {
  const scale = preset.scale;

  createChart(scale);

  const chart = chartState.chart;

  if (!chart) return;

  try {
    setWhitespace(chart, scale);

    console.log(`preset: ${preset.id}`);

    const legend = preset.applyPreset({
      chart,
      datasets,
      preset,
      activeResources,
    });

    legendSetter(legend);
  } catch (error) {
    console.error("chart: render: failed", error);
  }
}
