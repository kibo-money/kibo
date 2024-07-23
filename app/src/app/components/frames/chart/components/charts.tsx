import { chunkIdToIndex } from "/src/scripts/datasets/resource";
import {
  getInitialTimeRange,
  setActiveIds,
} from "/src/scripts/lightweightCharts/time";
import { createRWS } from "/src/solid/rws";

import { Chart } from "./chart";

export function Charts({
  firstChartSetter,
  preset,
  datasets,
  legendSetter,
  dark,
  activeIds,
}: {
  firstChartSetter: Setter<IChartApi | undefined>;
  preset: Accessor<Preset>;
  datasets: Datasets;
  legendSetter: Setter<SeriesLegend[]>;
  dark: Accessor<boolean>;
  activeIds: RWS<number[]>;
}) {
  const scale = createMemo(() => preset().scale);
  const exactRange = createRWS(getInitialTimeRange(scale()));
  const priceSeriesType = createRWS<PriceSeriesType>("Candlestick");
  const activeDatasets = createRWS([] as ResourceDataset<any, any>[], {
    equals: false,
  });
  const chartSeriesConfigs = createRWS([] as SeriesConfig[][], {
    equals: false,
  });
  const charts = createRWS(
    [] as {
      chart: RWS<IChartApi | undefined>;
      whitespace: RWS<ISeriesApiAny | undefined>;
    }[],
    {
      equals: false,
    },
  );
  const lastChartIndex = createMemo(() => chartSeriesConfigs().length - 1);
  const seriesCount = createMemo(() =>
    chartSeriesConfigs().reduce(
      (acc, l) => (acc += l.length),
      1, // Because of price series
    ),
  );
  const lastActiveIndex = createMemo(() => {
    const last = activeIds().at(-1);
    return last !== undefined
      ? chunkIdToIndex(preset().scale, last)
      : undefined;
  });
  const chartsDrawn = createMemo(() =>
    chartSeriesConfigs().map((_) => createRWS(true)),
  );

  createEffect(
    on([activeIds, activeDatasets], ([ids, activeDatasets]) => {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        for (let j = 0; j < activeDatasets.length; j++) {
          activeDatasets[j].fetch(id);
        }
      }
    }),
  );

  createEffect(
    on(preset, (preset) => {
      const scale = preset.scale;

      exactRange.set(getInitialTimeRange(scale));

      chartSeriesConfigs.set(
        [preset.top || [], preset.bottom].flatMap((list) =>
          list ? [list] : [],
        ),
      );

      charts.set(() =>
        new Array(chartSeriesConfigs().length).fill(undefined).map(() => ({
          chart: createRWS(undefined as IChartApi | undefined),
          whitespace: createRWS(undefined as ISeriesApiAny | undefined),
        })),
      );

      setActiveIds({
        exactRange: exactRange(),
        activeIds,
      });

      legendSetter(() => []);
    }),
  );

  onCleanup(() => {
    firstChartSetter(undefined);

    charts().map(({ chart, whitespace }) => {
      chart()?.remove();
      chart.set(undefined);
      whitespace.set(undefined);
    });
  });

  return (
    <For
      each={chartSeriesConfigs().filter(
        (configs, index) => index === 0 || configs.length !== 0,
      )}
    >
      {(seriesConfigs, index) => (
        <Chart
          activeDatasets={activeDatasets}
          activeIds={activeIds}
          charts={charts}
          chartsDrawn={chartsDrawn}
          dark={dark}
          datasets={datasets}
          exactRange={exactRange}
          firstChartSetter={firstChartSetter}
          index={index}
          lastActiveIndex={lastActiveIndex}
          lastChartIndex={lastChartIndex}
          legendSetter={legendSetter}
          preset={preset}
          priceSeriesType={priceSeriesType}
          seriesConfigs={seriesConfigs}
          seriesCount={seriesCount}
        />
      )}
    </For>
  );
}
