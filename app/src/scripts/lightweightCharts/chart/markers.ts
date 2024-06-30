import { colors } from "/src/scripts/utils/colors";
import { ONE_DAY_IN_MS } from "/src/scripts/utils/time";

import { chartState } from "./state";
import { GENESIS_DAY } from "./whitespace";

export const setMinMaxMarkers = ({
  scale,
  candlesticks,
  range,
  lowerOpacity,
}: {
  scale: ResourceScale;
  candlesticks: DatasetValue<CandlestickData | SingleValueData>[];
  range: TimeRange;
  lowerOpacity: boolean;
}) => {
  const first = candlesticks.at(0);

  if (!first) return;

  const offset =
    scale === "date"
      ? first.number - new Date(GENESIS_DAY).valueOf() / ONE_DAY_IN_MS
      : 0;

  const slicedDataList = range
    ? candlesticks.slice(
        Math.ceil(range.from - offset < 0 ? 0 : range.from - offset),
        Math.floor(range.to - offset) + 1,
      )
    : [];

  const series = chartState.priceSeries;

  if (!series) return;

  if (slicedDataList.length) {
    const markers: (SeriesMarker<Time> & Numbered)[] = [];

    const seriesIsCandlestick = series.seriesType() === "Candlestick";

    [
      {
        mathFunction: "min" as const,
        placementAttribute: seriesIsCandlestick
          ? ("low" as const)
          : ("close" as const),
        // valueAttribute: 'low' as const,
        markerOptions: {
          position: "belowBar" as const,
          shape: "arrowUp" as const,
        },
      },
      {
        mathFunction: "max" as const,
        placementAttribute: seriesIsCandlestick
          ? ("high" as const)
          : ("close" as const),
        // valueAttribute: 'high' as const,
        markerOptions: {
          position: "aboveBar" as const,
          shape: "arrowDown" as const,
        },
      },
    ].map(
      ({
        mathFunction,
        placementAttribute,
        // valueAttribute,
        markerOptions,
      }) => {
        const value = Math[mathFunction](
          // ...slicedDataList.map((data) => data[valueAttribute] || 0),
          ...slicedDataList.map(
            (data) =>
              (placementAttribute in data
                ? data[placementAttribute]
                : data.value) || 0,
          ),
        );

        const placement = Math[mathFunction](
          ...slicedDataList.map(
            (data) =>
              (placementAttribute in data
                ? data[placementAttribute]
                : data.value) || 0,
          ),
        );

        const candle = slicedDataList.find(
          (data) =>
            (placementAttribute in data
              ? data[placementAttribute]
              : data.value) === placement,
        );

        return (
          candle &&
          markers.push({
            ...markerOptions,
            number: candle.number,
            time: candle.time,
            color: lowerOpacity ? colors.darkWhite : colors.white,
            size: 0,
            text: value.toLocaleString("en-us"),
          })
        );
      },
    );

    series.setMarkers(sortWhitespaceDataArray(markers));
  }
};

function sortWhitespaceDataArray<T extends WhitespaceData & Numbered>(
  array: T[],
) {
  return array.sort(({ number: a }, { number: b }) => a - b);
}
