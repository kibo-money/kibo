import { HEIGHT_CHUNK_SIZE } from "../datasets";
import { debounce } from "../utils/debounce";
import { run } from "../utils/run";
import { tick } from "../utils/tick";
import { writeURLParam } from "../utils/urlParams";

const LOCAL_STORAGE_RANGE_KEY = "chart-range";
const URL_PARAMS_RANGE_FROM_KEY = "from";
const URL_PARAMS_RANGE_TO_KEY = "to";

export function getInitialTimeRange(scale: ResourceScale): TimeRange {
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

export function initTimeScale({
  scale,
  activeIds,
  exactRange,
  chart,
}: {
  scale: ResourceScale;
  activeIds: RWS<number[]>;
  exactRange: RWS<TimeRange>;
  chart: IChartApi;
}) {
  chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
    if (!range) return;

    exactRange.set(range);

    debouncedSetActiveIds({ exactRange: range, activeIds: activeIds });

    debouncedSaveTimeRange({ scale, range });
  });
}

function getLocalStorageKey(scale: ResourceScale) {
  return `${LOCAL_STORAGE_RANGE_KEY}-${scale}`;
}

export function setActiveIds({
  exactRange,
  activeIds,
}: {
  exactRange: TimeRange;
  activeIds: RWS<number[]>;
}) {
  let ids: number[] = [];

  const today = new Date();

  if (
    typeof exactRange.from === "string" &&
    typeof exactRange.to === "string"
  ) {
    const from = new Date(exactRange.from).getUTCFullYear();
    const to = new Date(exactRange.to).getUTCFullYear();

    ids = Array.from({ length: to - from + 1 }, (_, i) => i + from).filter(
      (year) => year >= 2009 && year <= today.getUTCFullYear(),
    );
  } else {
    const from = Math.floor(Number(exactRange.from) / HEIGHT_CHUNK_SIZE);
    const to = Math.floor(Number(exactRange.to) / HEIGHT_CHUNK_SIZE);

    const length = to - from + 1;

    ids = Array.from({ length }, (_, i) => (from + i) * HEIGHT_CHUNK_SIZE);
  }

  const old = activeIds();

  if (
    old.length !== ids.length ||
    old.at(0) !== ids.at(0) ||
    old.at(-1) !== ids.at(-1)
  ) {
    console.log("range:", ids);

    activeIds.set(ids);
  }
}

const debouncedSetActiveIds = debounce(setActiveIds, 100);

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
