import { colors } from "/src/scripts/utils/colors";

import { chunkIdToIndex } from "../datasets/resource";
import { valueToString } from "../utils/locale";

export function setMinMaxMarkers({
  scale,
  visibleRange,
  legendList,
  activeIds,
  dark,
}: {
  scale: ResourceScale;
  visibleRange: TimeRange | undefined;
  legendList: SeriesLegend[];
  activeIds: Accessor<number[]>;
  dark: Accessor<boolean>;
}) {
  try {
    if (!visibleRange) return;

    const { from, to } = visibleRange;

    const dateFrom = new Date(from as string);
    const dateTo = new Date(to as string);

    let max = undefined as [number, Time, number, ISeriesApi<any>] | undefined;
    let min = undefined as [number, Time, number, ISeriesApi<any>] | undefined;

    const ids = activeIds();

    for (let i = 0; i < legendList.length; i++) {
      const { seriesList, dataset } = legendList[i];

      for (let j = 0; j < ids.length; j++) {
        const id = ids[j];

        const seriesIndex = chunkIdToIndex(scale, id);

        const series = seriesList.at(seriesIndex)?.();

        if (!series || !series?.options().visible) continue;

        series.setMarkers([]);

        const isCandlestick = series.seriesType() === "Candlestick";

        const vec = dataset.fetchedJSONs.at(seriesIndex)?.vec();

        if (!vec) return;

        for (let k = 0; k < vec.length; k++) {
          const data = vec[k];

          let number;

          if (scale === "date") {
            const date =
              typeof data.time === "string"
                ? new Date(data.time)
                : // @ts-ignore
                  new Date(data.time.year, data.time.month, data.time.day);

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
      }
    }

    let minMarker: (SeriesMarker<Time> & { weight: number }) | undefined;
    let maxMarker: (SeriesMarker<Time> & { weight: number }) | undefined;

    if (min) {
      minMarker = {
        weight: min[0],
        time: min[1],
        color: colors.white(dark),
        position: "belowBar" as const,
        shape: "arrowUp" as const,
        size: 0,
        text: valueToString(min[2]),
      };
    }

    if (max) {
      maxMarker = {
        weight: max[0],
        time: max[1],
        color: colors.white(dark),
        position: "aboveBar" as const,
        shape: "arrowDown" as const,
        size: 0,
        text: valueToString(max[2]),
      };
    }

    if (min && max && min[3] === max[3] && minMarker && maxMarker) {
      min[3].setMarkers(
        [minMarker, maxMarker].sort((a, b) => a.weight - b.weight),
      );
    } else {
      if (min && minMarker) {
        min[3].setMarkers([minMarker]);
      }

      if (max && maxMarker) {
        max[3].setMarkers([maxMarker]);
      }
    }
  } catch (e) {}
}
