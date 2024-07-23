import { createRWS } from "/src/solid/rws";

import { chunkIdToIndex } from "../datasets/resource";
import { SeriesType } from "../presets/enums";
import { stringToId } from "../utils/id";
import { createBaseLineSeries, DEFAULT_BASELINE_COLORS } from "./baseLine";
import { createCandlesticksSeries } from "./candlesticks";
import { createHistogramSeries } from "./histogram";
import { createSeriesLegend } from "./legend";
import { createLineSeries } from "./line";

export function createSeriesGroup<Scale extends ResourceScale>({
  scale,
  datasets,
  activeIds,
  seriesConfig,
  preset,
  chartLegend,
  chart,
  index: seriesIndex,
  disabled,
  lastActiveIndex,
  debouncedSetMinMaxMarkers,
  dark,
}: {
  scale: Scale;
  datasets: Datasets;
  activeIds: Accessor<number[]>;
  seriesConfig: SeriesConfig;
  preset: Preset;
  chart: IChartApi;
  index: number;
  chartLegend: SeriesLegend[];
  lastActiveIndex: Accessor<number | undefined>;
  disabled?: Accessor<boolean>;
  debouncedSetMinMaxMarkers: VoidFunction;
  dark: Accessor<boolean>;
}) {
  const {
    datasetPath,
    title,
    colors,
    color,
    defaultVisible,
    seriesType: type,
    options,
    priceScaleOptions,
  } = seriesConfig;

  const dataset = datasets.getOrImport(
    scale,
    datasetPath as DatasetPath<Scale>,
  );

  const seriesList: RWS<
    ISeriesApi<"Baseline" | "Line" | "Histogram" | "Candlestick"> | undefined
  >[] = new Array(dataset.fetchedJSONs.length);

  const legend = createSeriesLegend({
    scale,
    id: stringToId(title),
    presetId: preset.id,
    title,
    seriesList,
    color: colors || color || DEFAULT_BASELINE_COLORS,
    defaultVisible,
    disabled,
    dataset,
  });

  chartLegend.push(legend);

  dataset.fetchedJSONs.forEach((json, index) => {
    const series: (typeof seriesList)[number] = createRWS(undefined);

    seriesList[index] = series;

    createEffect(() => {
      const values = json.vec();

      if (!values) return;

      if (seriesIndex > 0) {
        let previous = chartLegend.at(seriesIndex - 1)?.seriesList[index];

        if (!previous?.()) {
          return;
        }
      }

      untrack(() => {
        let s = series();

        if (!s) {
          switch (type) {
            case SeriesType.Based: {
              s = createBaseLineSeries({
                chart,
                dark,
                color,
                topColor: seriesConfig.topColor,
                bottomColor: seriesConfig.bottomColor,
                options,
              });

              break;
            }
            case SeriesType.Candlestick: {
              const candlestickSeries = createCandlesticksSeries({
                chart,
                options,
                dark,
              });

              s = candlestickSeries[0];

              if (!colors && !color) {
                legend.color = candlestickSeries[1];
              }

              break;
            }
            case SeriesType.Histogram: {
              s = createHistogramSeries({
                chart,
                options,
              });

              break;
            }
            default:
            case SeriesType.Line: {
              s = createLineSeries({
                chart,
                color,
                dark,
                options,
              });

              break;
            }
          }

          if (priceScaleOptions) {
            s.priceScale().applyOptions(priceScaleOptions);
          }

          series.set(s);
        }

        s.setData(values);

        debouncedSetMinMaxMarkers();
      });
    });

    createEffect(() => {
      const s = series();
      const currentVec = dataset.fetchedJSONs.at(index)?.vec();
      const nextVec = dataset.fetchedJSONs.at(index + 1)?.vec();

      if (s && currentVec?.length && nextVec?.length) {
        s.update(nextVec[0]);
      }
    });

    const isLast = createMemo(() => {
      const last = lastActiveIndex();
      return last !== undefined && last === index;
    });

    createEffect(() => {
      series()?.applyOptions({
        lastValueVisible: legend.drawn() && isLast(),
      });
    });

    const inRange = createMemo(() => {
      const range = activeIds();

      if (range.length) {
        const start = chunkIdToIndex(scale, range.at(0)!);
        const end = chunkIdToIndex(scale, range.at(-1)!);

        if (index >= start && index <= end) {
          return true;
        }
      }

      return false;
    });

    const visible = createMemo((previous: boolean) => {
      if (legend.disabled()) {
        return false;
      }

      return previous || inRange();
    }, false);

    createEffect(() => {
      series()?.applyOptions({
        visible: legend.drawn() && visible(),
      });
    });
  });

  return legend;
}
