import {
  ONE_DAY_IN_MS,
  ONE_HOUR_IN_MS,
  ONE_MINUTE_IN_MS,
} from "/src/scripts/utils/time";
import { createRWS } from "/src/solid/rws";

import { HEIGHT_CHUNK_SIZE } from ".";
import { debounce } from "../utils/debounce";

export function createResourceDataset<
  Scale extends ResourceScale,
  Type extends OHLC | number = number,
>({ scale, path }: { scale: Scale; path: string }) {
  type Dataset = Scale extends "date"
    ? FetchedDateDataset<Type>
    : FetchedHeightDataset<Type>;

  type Value = DatasetValue<
    Type extends number ? SingleValueData : CandlestickData
  >;

  const baseURL = `${
    // location.hostname === "localhost"
    //   ? "http://localhost:3110"
    //   : "https://api.satonomics.xyz"
    "https://api.satonomics.xyz"
  }${path}`;

  const fetchedJSONs = new Array(
    (new Date().getFullYear() - new Date("2009-01-01").getFullYear() + 2) *
      (scale === "date" ? 1 : 6),
  )
    .fill(null)
    .map((): FetchedResult<Scale, Type> => {
      const json = createRWS<FetchedJSON<Scale, Type, Dataset> | null>(null);

      return {
        at: null,
        json,
        loading: false,
        vec: createMemo(() => {
          const map = json()?.dataset.map || null;

          if (!map) {
            return null;
          }

          const chunkId = json()?.chunk.id!;

          if (Array.isArray(map)) {
            return map.map(
              (value, index) =>
                ({
                  number: chunkId + index,
                  time: (chunkId + index) as Time,
                  ...(typeof value !== "number" && value !== null
                    ? { ...(value as OHLC), value: value.close }
                    : { value: value === null ? NaN : (value as number) }),
                }) as any as Value,
            );
          } else {
            return Object.entries(map).map(
              ([date, value]) =>
                ({
                  number: new Date(date).valueOf() / ONE_DAY_IN_MS,
                  time: date,
                  ...(typeof value !== "number" && value !== null
                    ? { ...(value as OHLC), value: value.close }
                    : { value: value === null ? NaN : (value as number) }),
                }) as any as Value,
            );
          }
        }),
      };
    }) as FetchedResult<Scale, Type>[];

  const _fetch = async (id: number) => {
    const index = chunkIdToIndex(scale, id);

    if (
      index < 0 ||
      (scale === "date" && id > new Date().getUTCFullYear()) ||
      (scale === "height" &&
        id > 165 * 365 * (new Date().getUTCFullYear() - 2009))
    ) {
      return;
    }

    const fetched = fetchedJSONs.at(index);

    if (!fetched || fetched.loading) {
      return;
    } else if (fetched.at) {
      const diff = new Date().valueOf() - fetched.at.valueOf();

      if (
        diff < ONE_MINUTE_IN_MS ||
        (index < fetchedJSONs.findLastIndex((json) => json.at) &&
          diff < ONE_HOUR_IN_MS)
      ) {
        return;
      }
    }

    fetched.loading = true;

    let cache: Cache | undefined;

    const urlWithQuery = `${baseURL}?chunk=${id}`;

    if (!fetched.json()) {
      try {
        cache = await caches.open("resources");

        const cachedResponse = await cache.match(urlWithQuery);

        if (cachedResponse) {
          const json = await convertResponseToJSON<Scale, Type>(cachedResponse);

          if (json) {
            console.log(`cache: ${path}?chunk=${id}`);

            fetched.json.set(() => json);
          }
        }
      } catch {}
    }

    try {
      const fetchedResponse = await fetch(urlWithQuery);

      if (!fetchedResponse.ok) {
        fetched.loading = false;
        return;
      }

      const clonedResponse = fetchedResponse.clone();

      const json = await convertResponseToJSON<Scale, Type>(fetchedResponse);

      if (json) {
        console.log(`fetch: ${path}?chunk=${id}`);

        const previousMap = fetched.json()?.dataset.map;
        const newMap = json.dataset.map;

        const previousLength = Object.keys(previousMap || []).length;
        const newLength = Object.keys(newMap).length;

        if (!newLength) {
          fetched.loading = false;
          return;
        }

        if (previousLength && previousLength <= newLength) {
          const previousLastValue = Object.values(previousMap || []).at(-1);
          const newLastValue = Object.values(newMap).at(-1);

          if (typeof newLastValue === "number") {
            if (previousLastValue === newLastValue) {
              fetched.at = new Date();
              fetched.loading = false;
              return;
            }
          } else {
            const previousLastOHLC = previousLastValue as OHLC;
            const newLastOHLC = newLastValue as OHLC;

            if (
              previousLastOHLC.open === newLastOHLC.open &&
              previousLastOHLC.high === newLastOHLC.high &&
              previousLastOHLC.low === newLastOHLC.low &&
              previousLastOHLC.close === newLastOHLC.close
            ) {
              fetched.loading = false;
              fetched.at = new Date();
              return;
            }
          }
        }

        fetched.json.set(() => json);

        if (cache) {
          cache.put(urlWithQuery, clonedResponse);
        }
      }
    } catch {
      fetched.loading = false;
      return;
    }

    fetched.at = new Date();
    fetched.loading = false;
  };

  const valuesCallback = (vecs: Value[][]) => {
    let length = 0;
    for (let i = 0; i < vecs.length; i++) {
      length += vecs[i].length;
    }

    if (!length) return;

    const array = new Array(length);
    let k = 0;
    for (let i = 0; i < vecs.length; i++) {
      let vec = vecs[i];
      for (let j = 0; j < vec.length; j++) {
        array[k++] = vec[j];
      }
    }

    if (k !== length) throw Error("e");

    values.set(array);
  };

  const debouncedValuesCallback = debounce(valuesCallback, 100);

  const values = createRWS<Value[]>([]);

  createEffect(() => {
    const vecs = fetchedJSONs.map((fetched) => fetched.vec() || []);
    debouncedValuesCallback(vecs);
  });

  const resource: ResourceDataset<Scale, Type> = {
    scale,
    url: baseURL,
    fetch: _fetch,
    fetchedJSONs,
    values,
    drop() {
      fetchedJSONs.forEach((fetched) => {
        fetched.at = null;
        fetched.json.set(null);
      });
    },
  };

  return resource;
}

async function convertResponseToJSON<
  Scale extends ResourceScale,
  Type extends number | OHLC,
>(response: Response) {
  try {
    return (await response.json()) as FetchedJSON<Scale, Type>;
  } catch (_) {
    return null;
  }
}

function chunkIdToIndex(scale: ResourceScale, id: number) {
  return scale === "date" ? id - 2009 : Math.floor(id / HEIGHT_CHUNK_SIZE);
}
