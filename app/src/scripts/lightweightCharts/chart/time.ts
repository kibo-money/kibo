import { HEIGHT_CHUNK_SIZE } from "../../datasets";
import { debounce } from "../../utils/debounce";
import { writeURLParam } from "../../utils/urlParams";
import {
  chartState,
  LOCAL_STORAGE_RANGE_KEY,
  URL_PARAMS_RANGE_FROM_KEY,
  URL_PARAMS_RANGE_TO_KEY,
} from "./state";

const debouncedUpdateURLParams = debounce((range: TimeRange | null) => {
  if (!range) return;

  writeURLParam(URL_PARAMS_RANGE_FROM_KEY, String(range.from));

  writeURLParam(URL_PARAMS_RANGE_TO_KEY, String(range.to));

  localStorage.setItem(LOCAL_STORAGE_RANGE_KEY, JSON.stringify(range));
}, 500);

export function initTimeScale({
  activeDatasets,
}: {
  activeDatasets: Set<ResourceDataset<any, any>>;
}) {
  setTimeScale(chartState.range);

  const debouncedFetch = debounce((range: TimeRange | null) => {
    if (!range) return;

    let ids: number[] = [];

    if (typeof range.from === "string" && typeof range.to === "string") {
      const from = new Date(range.from).getUTCFullYear();
      const to = new Date(range.to).getUTCFullYear();

      ids = Array.from({ length: to - from + 1 }, (_, i) => i + from);
    } else {
      const from = Math.floor(Number(range.from) / HEIGHT_CHUNK_SIZE);
      const to = Math.floor(Number(range.to) / HEIGHT_CHUNK_SIZE);

      const length = to - from + 1;

      ids = Array.from({ length }, (_, i) => (from + i) * HEIGHT_CHUNK_SIZE);
    }

    ids.forEach((id) => {
      activeDatasets.forEach((dataset) => dataset.fetch(id));
    });
  }, 100);

  debouncedFetch(chartState.range);

  let timeout = setTimeout(() => {
    chartState.chart?.timeScale().subscribeVisibleTimeRangeChange((range) => {
      debouncedFetch(range);

      debouncedUpdateURLParams(range);

      range = range || chartState.range;

      chartState.range = range;
    });
  }, 50);

  onCleanup(() => clearTimeout(timeout));
}

export function getInitialRange(): TimeRange {
  const urlParams = new URLSearchParams(window.location.search);

  const urlFrom = urlParams.get(URL_PARAMS_RANGE_FROM_KEY);
  const urlTo = urlParams.get(URL_PARAMS_RANGE_TO_KEY);

  if (urlFrom && urlTo) {
    return {
      from: urlFrom,
      to: urlTo,
    } satisfies TimeRange;
  }

  const savedTimeRange = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_RANGE_KEY) || "null",
  ) as TimeRange | null;

  if (savedTimeRange) {
    return savedTimeRange;
  }

  const defaultTo = new Date();
  const defaultFrom = new Date();
  defaultFrom.setDate(defaultFrom.getUTCDate() - 6 * 30);

  const defaultTimeRange = {
    from: defaultFrom.toJSON().split("T")[0],
    to: defaultTo.toJSON().split("T")[0],
  } satisfies TimeRange;

  return defaultTimeRange;
}

export function setTimeScale(range: TimeRange | null) {
  if (range) {
    setTimeout(() => {
      chartState.chart?.timeScale().setVisibleRange(range);
    }, 1);
  }
}
