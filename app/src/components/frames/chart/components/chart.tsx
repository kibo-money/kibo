import { requestIdleCallbackPossible } from "/src/env";
import { chunkIdToIndex } from "/src/scripts/datasets/resource";
import { createChart } from "/src/scripts/lightweightCharts/create";
import { createSeriesGroup } from "/src/scripts/lightweightCharts/group";
import { setMinMaxMarkers } from "/src/scripts/lightweightCharts/markers";
import {
  debouncedUpdateVisiblePriceSeriesType,
  updateVisiblePriceSeriesType,
} from "/src/scripts/lightweightCharts/price";
import {
  initTimeScale,
  setInitialTimeRange,
} from "/src/scripts/lightweightCharts/time";
import { setWhitespace } from "/src/scripts/lightweightCharts/whitespace";
import { SeriesType } from "/src/scripts/presets/enums";
import { colors } from "/src/scripts/utils/colors";
import { debounce } from "/src/scripts/utils/debounce";
import { createSL } from "/src/scripts/utils/selectableList/static";
import { webSockets } from "/src/scripts/ws";
import { classPropToString } from "/src/solid/classes";
import { createRWS } from "/src/solid/rws";

import { RadioGroup } from "../../settings";

export function Chart({
  activeDatasets,
  activeIds,
  charts,
  chartsDrawn,
  dark,
  datasets,
  exactRange,
  firstChartSetter,
  index,
  lastActiveIndex,
  lastChartIndex,
  legendSetter,
  preset: presetAccessor,
  priceSeriesType,
  seriesConfigs,
  seriesCount,
}: {
  activeDatasets: ReadWriteSignal<ResourceDataset<any, any>[]>;
  activeIds: RWS<number[]>;
  charts: ReadWriteSignal<
    {
      chart: RWS<IChartApi | undefined>;
      whitespace: RWS<ISeriesApiAny | undefined>;
    }[]
  >;
  chartsDrawn: Accessor<ReadWriteSignal<boolean>[]>;
  dark: Accessor<boolean>;
  datasets: Datasets;
  exactRange: ReadWriteSignal<TimeRange>;
  firstChartSetter: Setter<IChartApi | undefined>;
  index: Accessor<number>;
  lastActiveIndex: Accessor<number | undefined>;
  lastChartIndex: Accessor<number>;
  legendSetter: Setter<SeriesLegend[]>;
  preset: Accessor<Preset>;
  priceSeriesType: ReadWriteSignal<PriceSeriesType>;
  seriesConfigs: SeriesConfig[];
  seriesCount: Accessor<number>;
}) {
  const div = createRWS<HTMLDivElement | undefined>(undefined);
  const chartIndex = index();

  const isDrawn = chartsDrawn()[chartIndex];
  const isLastDrawn = createMemo(
    () => chartsDrawn().findLastIndex((drawn) => drawn()) === chartIndex,
  );

  const chartPriceModeKey = `chart-price-mode-${chartIndex}` as const;
  const chartPriceMode = createSL(["Linear", "Log"] as const, {
    saveable: {
      key: chartPriceModeKey,
      mode: "localStorage",
    },
    defaultValue: chartIndex === 0 ? "Log" : "Linear",
  });

  createEffect(
    on([div, () => charts()[chartIndex]], ([div, chartConfig]) => {
      if (!div || !chartConfig) return;

      const preset = presetAccessor();
      const scale = preset.scale;

      const chart = createChart({
        scale,
        element: div,
        dark,
      });

      if (!chart) {
        console.log("chart: undefined");
        return;
      }

      const whitespace = setWhitespace(chart, scale);

      batch(() => {
        chartConfig.chart.set(chart);
        chartConfig.whitespace.set(whitespace);

        if (chartIndex === 0) {
          firstChartSetter(chart);
        }
      });

      const range = exactRange();

      setInitialTimeRange({ chart, range });

      if (chartIndex === 0) {
        initTimeScale({
          scale,
          chart,
          activeIds,
          exactRange,
        });

        if (range) {
          updateVisiblePriceSeriesType({
            scale,
            chart,
            priceSeriesType,
            timeRange: range,
          });
        }
      }

      const chartLegend: SeriesLegend[] = [];

      onCleanup(() => {
        chartLegend.length = 0;
      });

      const markerCallback = () =>
        setMinMaxMarkers({
          scale,
          visibleRange: exactRange(),
          legendList: chartLegend,
          dark,
          activeIds: activeIds,
        });

      const debouncedSetMinMaxMarkers = requestIdleCallbackPossible
        ? () => requestIdleCallback(markerCallback)
        : debounce(
            markerCallback,
            seriesCount() * 10 + scale === "date" ? 50 : 100,
          );

      createEffect(on([exactRange, dark], debouncedSetMinMaxMarkers));

      if (chartIndex === 0) {
        const datasetPath: AnyDatasetPath = `${scale}-to-price`;

        const dataset = datasets.getOrImport(scale, datasetPath);

        // Don't trigger reactivity by design
        activeDatasets().push(dataset);

        const title = "Price";

        function createPriceSeries(seriesType: PriceSeriesType) {
          let seriesConfig: SeriesConfig;

          if (seriesType === "Candlestick") {
            seriesConfig = {
              datasetPath,
              title,
              seriesType: SeriesType.Candlestick,
            };
          } else {
            seriesConfig = {
              datasetPath,
              title,
              color: colors.white,
            };
          }

          const priceSeries = createSeriesGroup({
            scale,
            datasets,
            index: -1,
            activeIds,
            seriesConfig,
            chart,
            chartLegend,
            lastActiveIndex,
            preset,
            disabled: () => priceSeriesType() !== seriesType,
            debouncedSetMinMaxMarkers,
            dark,
          });

          createEffect(() => {
            const latest = webSockets.liveKrakenCandle.latest();

            if (!latest) return;

            const index = chunkIdToIndex(scale, latest.year);

            const series = priceSeries.seriesList.at(index)?.();

            series?.update(latest);
          });

          return priceSeries;
        }

        const priceCandlestickLegend = createPriceSeries("Candlestick");
        const priceLineLegend = createPriceSeries("Line");

        createEffect(() => {
          priceCandlestickLegend.visible.set(priceLineLegend.visible());
        });

        createEffect(() => {
          priceLineLegend.visible.set(priceCandlestickLegend.visible());
        });
      }

      [...seriesConfigs].reverse().forEach((seriesConfig, index) => {
        const dataset = datasets.getOrImport(scale, seriesConfig.datasetPath);

        // Don't trigger reactivity by design
        activeDatasets().push(dataset);

        createSeriesGroup({
          scale,
          datasets,
          activeIds,
          index,
          seriesConfig,
          chartLegend,
          chart,
          preset,
          lastActiveIndex,
          debouncedSetMinMaxMarkers,
          dark,
        });
      });

      chartLegend.forEach((legend) => {
        createEffect(on(legend.visible, debouncedSetMinMaxMarkers));
      });

      legendSetter((l) => {
        for (let i = 0; i < chartLegend.length; i++) {
          l.splice(0, 0, chartLegend[i]);
        }
        return l;
      });

      createEffect(() =>
        isDrawn.set(() => chartLegend.some((legend) => legend.drawn())),
      );

      createEffect(() =>
        chart.timeScale().applyOptions({
          visible: isLastDrawn(),
        }),
      );

      createEffect(() =>
        chart.priceScale("right").applyOptions({
          mode: chartPriceMode.selected() === "Linear" ? 0 : 1,
        }),
      );

      chart.timeScale().subscribeVisibleLogicalRangeChange((logicalRange) => {
        if (!logicalRange) return;

        // Must be the chart with the visible timeScale
        if (chartIndex === lastChartIndex()) {
          debouncedUpdateVisiblePriceSeriesType({
            scale,
            chart,
            logicalRange,
            priceSeriesType,
          });
        }

        for (
          let otherChartIndex = 0;
          otherChartIndex <= lastChartIndex();
          otherChartIndex++
        ) {
          if (chartIndex !== otherChartIndex) {
            const chart = charts()[otherChartIndex].chart();

            chart?.timeScale().setVisibleLogicalRange(logicalRange);
          }
        }
      });

      chart.subscribeCrosshairMove(({ time, sourceEvent }) => {
        // Don't override crosshair position from scroll event
        if (time && !sourceEvent) return;

        for (
          let otherChartIndex = 0;
          otherChartIndex <= lastChartIndex();
          otherChartIndex++
        ) {
          const { whitespace: _whitespace, chart: _otherChart } =
            charts()[otherChartIndex];

          const otherChart = _otherChart();
          const whitespace = _whitespace();

          if (otherChart && whitespace && chartIndex !== otherChartIndex) {
            if (time) {
              otherChart.setCrosshairPosition(NaN, time, whitespace);
            } else {
              // No time when mouse goes outside the chart
              otherChart.clearCrosshairPosition();
            }
          }
        }
      });

      // Trigger reactivity now
      activeDatasets.set((l) => l);
    }),
  );

  return (
    <div
      style={{
        height: isLastDrawn() ? "100%" : "calc(100% - 62px)",
      }}
      class={classPropToString([
        isDrawn()
          ? [
              "max-h-full",
              // isLastDrawn() ? "mb-[-2px]"
            ]
          : "max-h-0",
        "relative h-full min-h-0 w-full cursor-crosshair",
      ])}
    >
      <div ref={div.set} class="size-full" />

      <Show when={isDrawn()}>
        <div class="pointer-events-none absolute left-0 top-0 z-10 flex items-center space-x-2 px-6 text-xs">
          <span>
            {chartIndex === 0
              ? ("US Dollars" satisfies Unit)
              : presetAccessor().unit}
          </span>
          <span class="off">—</span>
          <RadioGroup size="xs" title={chartPriceModeKey} sl={chartPriceMode} />
        </div>
      </Show>
    </div>
  );
}
