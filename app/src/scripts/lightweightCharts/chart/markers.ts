import { colors } from "/src/scripts/utils/colors";

import { chunkIdToIndex } from "../../datasets/resource";

export function setMinMaxMarkers({
  scale,
  visibleRange,
  legendList,
  activeRange,
}: {
  scale: ResourceScale;
  visibleRange: TimeRange | undefined;
  legendList: SeriesLegend[];
  activeRange: Accessor<number[]>;
}) {
  if (!visibleRange) return;

  const { from, to } = visibleRange;

  const dateFrom = new Date(from as string);
  const dateTo = new Date(to as string);

  let max = undefined as [number, Time, number, ISeriesApi<any>] | undefined;
  let min = undefined as [number, Time, number, ISeriesApi<any>] | undefined;

  legendList.forEach(({ seriesList, dataset }) => {
    activeRange().forEach((id) => {
      const seriesIndex = chunkIdToIndex(scale, id);

      const series = seriesList.at(seriesIndex)?.();

      if (!series || !series?.options().visible) return;

      series.setMarkers([]);

      const isCandlestick = series.seriesType() === "Candlestick";

      const vec = dataset.fetchedJSONs.at(seriesIndex)?.vec();

      if (!vec) return;

      for (let i = 0; i < vec.length; i++) {
        const data = vec[i];

        let number;

        if (scale === "date") {
          const date = new Date(
            typeof data.time === "string"
              ? data.time
              : // @ts-ignore
                `${data.time.year}-${data.time.month}-${data.time.day}`,
          );

          number = date.getTime();

          if (date <= dateFrom || date >= dateTo) {
            continue;
          }
        } else {
          const height = data.time;

          number = height as number;

          if (height <= from || height >= to) {
            continue;
          }
        }

        // @ts-ignore
        const high = isCandlestick ? data["high"] : data.value;
        // @ts-ignore
        const low = isCandlestick ? data["low"] : data.value;

        if (!max || high > max[2]) {
          max = [number, data.time, high, series];
        }
        if (!min || low < min[2]) {
          min = [number, data.time, low, series];
        }
      }
    });
  });

  let minMarker: (SeriesMarker<Time> & { weight: number }) | undefined;
  let maxMarker: (SeriesMarker<Time> & { weight: number }) | undefined;

  if (min) {
    minMarker = {
      weight: min[0],
      time: min[1],
      color: colors.white,
      position: "belowBar" as const,
      shape: "arrowUp" as const,
      size: 0,
      text: min[2].toLocaleString("en-us"),
    };
  }

  if (max) {
    maxMarker = {
      weight: max[0],
      time: max[1],
      color: colors.white,
      position: "aboveBar" as const,
      shape: "arrowDown" as const,
      size: 0,
      text: max[2].toLocaleString("en-us"),
    };
  }

  if (min && max && min[3] === max[3] && minMarker && maxMarker) {
    const series = min[3];
    series.setMarkers(
      [minMarker, maxMarker].sort((a, b) => a.weight - b.weight),
    );
  } else {
    if (min && minMarker) {
      const series = min[3];
      series.setMarkers([minMarker]);
    }

    if (max && maxMarker) {
      const series = max[3];
      series.setMarkers([maxMarker]);
    }
  }
}
