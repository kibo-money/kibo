import { HEIGHT_CHUNK_SIZE } from "../datasets";
import { debounce } from "../utils/debounce";
import { writeURLParam } from "../utils/urlParams";

const LOCAL_STORAGE_RANGE_KEY = "chart-range";
const URL_PARAMS_RANGE_FROM_KEY = "from";
const URL_PARAMS_RANGE_TO_KEY = "to";

export function initTimeScale({
  scale,
  activeRange,
  exactRange,
  charts,
}: {
  scale: ResourceScale;
  activeRange: RWS<number[]>;
  exactRange: RWS<TimeRange | undefined>;
  charts: ChartObject[];
}) {
  const firstChart = charts.at(0)?.chart;

  if (!firstChart) return;

  firstChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
    if (!range) return;

    exactRange.set(range);

    debouncedSetActiveRange({ range, activeRange });

    debouncedSaveTimeRange({ scale, range });
  });

  setTimeScale(firstChart, getInitialRange(scale));
}

function setTimeScale(chart: IChartApi, range: TimeRange | null) {
  if (range) {
    setTimeout(() => {
      chart.timeScale().setVisibleRange(range);
    }, 1);
  }
}

function getInitialRange(scale: ResourceScale): TimeRange {
  const urlParams = new URLSearchParams(window.location.search);

  const urlFrom = urlParams.get(URL_PARAMS_RANGE_FROM_KEY);
  const urlTo = urlParams.get(URL_PARAMS_RANGE_TO_KEY);

  if (urlFrom && urlTo) {
    if (scale === "date" && urlFrom.includes("-") && urlTo.includes("-")) {
      return {
        from: new Date(urlFrom).toJSON().split("T")[0],
        to: new Date(urlTo).toJSON().split("T")[0],
      } satisfies TimeRange;
    } else if (
      scale === "height" &&
      !urlFrom.includes("-") &&
      !urlTo.includes("-")
    ) {
      return {
        from: Number(urlFrom),
        to: Number(urlTo),
      } as any satisfies TimeRange;
    }
  }

  const savedTimeRange = JSON.parse(
    localStorage.getItem(getLocalStorageKey(scale)) || "null",
  ) as TimeRange | null;

  if (savedTimeRange) {
    return savedTimeRange;
  }

  switch (scale) {
    case "date": {
      const defaultTo = new Date();
      const defaultFrom = new Date();
      defaultFrom.setDate(defaultFrom.getUTCDate() - 6 * 30);

      return {
        from: defaultFrom.toJSON().split("T")[0],
        to: defaultTo.toJSON().split("T")[0],
      } satisfies TimeRange;
    }
    case "height": {
      return {
        from: 800_000,
        to: 850_000,
      } as any satisfies TimeRange;
    }
  }
}

function getLocalStorageKey(scale: ResourceScale) {
  return `${LOCAL_STORAGE_RANGE_KEY}-${scale}`;
}

function setActiveRange({
  range,
  activeRange,
}: {
  range: TimeRange;
  activeRange: RWS<number[]>;
}) {
  let ids: number[] = [];

  const today = new Date();

  if (typeof range.from === "string" && typeof range.to === "string") {
    const from = new Date(range.from).getUTCFullYear();
    const to = new Date(range.to).getUTCFullYear();

    ids = Array.from({ length: to - from + 1 }, (_, i) => i + from).filter(
      (year) => year >= 2009 && year <= today.getUTCFullYear(),
    );
  } else {
    const from = Math.floor(Number(range.from) / HEIGHT_CHUNK_SIZE);
    const to = Math.floor(Number(range.to) / HEIGHT_CHUNK_SIZE);

    const length = to - from + 1;

    ids = Array.from({ length }, (_, i) => (from + i) * HEIGHT_CHUNK_SIZE);
  }

  const old = activeRange();

  if (
    old.length !== ids.length ||
    old.at(0) !== ids.at(0) ||
    old.at(-1) !== ids.at(-1)
  ) {
    console.log("range:", ids);

    activeRange.set(ids);
  }
}

const debouncedSetActiveRange = debounce(setActiveRange, 100);

function saveTimeRange({
  scale,
  range,
}: {
  scale: ResourceScale;
  range: TimeRange;
}) {
  writeURLParam(URL_PARAMS_RANGE_FROM_KEY, String(range.from));

  writeURLParam(URL_PARAMS_RANGE_TO_KEY, String(range.to));

  localStorage.setItem(getLocalStorageKey(scale), JSON.stringify(range));
}

const debouncedSaveTimeRange = debounce(saveTimeRange, 500);
