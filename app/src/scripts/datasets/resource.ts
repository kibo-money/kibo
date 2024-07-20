import { requestIdleCallbackPossible } from "/src/env";
import { ONE_HOUR_IN_MS, ONE_MINUTE_IN_MS } from "/src/scripts/utils/time";
import { createRWS } from "/src/solid/rws";

import { HEIGHT_CHUNK_SIZE } from ".";

const USE_LOCAL_URL = true;
const LOCAL_URL = "http://localhost:3110";
const WEB_URL = "https://api.satonomics.xyz";
const BACKUP_WEB_URL = "https://api-bkp.satonomics.xyz";

export function createResourceDataset<
  Scale extends ResourceScale,
  Type extends OHLC | number = number,
>({ scale, path }: { scale: Scale; path: string }) {
  type Value = DatasetValue<
    Type extends number ? SingleValueData : CandlestickData
  >;

  const baseURL = `${
    USE_LOCAL_URL && location.hostname === "localhost" ? LOCAL_URL : WEB_URL
  }${path}`;

  const backupURL = `${
    USE_LOCAL_URL && location.hostname === "localhost"
      ? LOCAL_URL
      : BACKUP_WEB_URL
  }${path}`;

  return createRoot((dispose) => {
    const fetchedJSONs = new Array(
      (new Date().getFullYear() - new Date("2009-01-01").getFullYear() + 2) *
        (scale === "date" ? 1 : 6),
    )
      .fill(null)
      .map((): FetchedResult<Scale, Type> => {
        const json = createRWS<FetchedJSON<Scale, Type> | null>(null);

        return {
          at: null,
          json,
          loading: false,
          vec: createMemo(() => {
            const map = json()?.dataset.map;

            if (!map) {
              return null;
            }

            const chunkId = json()?.chunk.id!;

            if (Array.isArray(map)) {
              const values = new Array(map.length);

              for (let i = 0; i < map.length; i++) {
                const value = map[i];

                values[i] = {
                  time: (chunkId + i) as Time,
                  ...(typeof value !== "number" && value !== null
                    ? { ...(value as OHLC), value: value.close }
                    : { value: value === null ? NaN : (value as number) }),
                } as any as Value;
              }

              return values;
            } else {
              return Object.entries(map).map(
                ([date, value]) =>
                  ({
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

      if (scale === "height" && index > 0) {
        const length = fetchedJSONs.at(index - 1)?.vec()?.length;

        if (length !== undefined && length < HEIGHT_CHUNK_SIZE) {
          return;
        }
      }

      if (!fetched || fetched.loading) {
        return;
      } else if (fetched.at) {
        const diff = new Date().getTime() - fetched.at.getTime();

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
      const backupUrlWithQuery = `${backupURL}?chunk=${id}`;

      if (!fetched.json()) {
        try {
          cache = await caches.open("resources");

          const cachedResponse = await cache.match(urlWithQuery);

          if (cachedResponse) {
            const json = await convertResponseToJSON<Scale, Type>(
              cachedResponse,
            );

            if (json) {
              console.log(`cache: ${path}?chunk=${id}`);

              fetched.json.set(() => json);
            }
          }
        } catch {}
      }

      if (!navigator.onLine) {
        fetched.loading = false;
        return;
      }

      let fetchedResponse: Response | undefined;

      const fetchConfig: RequestInit = {
        signal: AbortSignal.timeout(5000),
      };

      try {
        fetchedResponse = await fetch(urlWithQuery, fetchConfig);

        if (!fetchedResponse.ok) {
          throw Error;
        }
      } catch {
        try {
          fetchedResponse = await fetch(backupUrlWithQuery, fetchConfig);
        } catch {
          fetched.loading = false;
          return;
        }

        if (!fetchedResponse || !fetchedResponse.ok) {
          fetched.loading = false;
          return;
        }
      }

      const clonedResponse = fetchedResponse.clone();

      const json = await convertResponseToJSON<Scale, Type>(fetchedResponse);

      if (!json) {
        fetched.loading = false;
        return;
      }

      console.log(`fetch: ${path}?chunk=${id}`);

      const previousMap = fetched.json()?.dataset;
      const newMap = json.dataset.map;

      const previousLength = Object.keys(previousMap || []).length;
      const newLength = Object.keys(newMap).length;

      if (!newLength) {
        fetched.loading = false;
        return;
      }

      if (previousLength && previousLength === newLength) {
        const previousLastValue = Object.values(previousMap || []).at(-1);
        const newLastValue = Object.values(newMap).at(-1);

        if (newLastValue === null && previousLastValue === null) {
          fetched.at = new Date();
          fetched.loading = false;
          return;
        } else if (typeof newLastValue === "number") {
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

      async function saveToCache() {
        try {
          await cache?.put(urlWithQuery, clonedResponse);
        } catch (_) {}
      }

      if (requestIdleCallbackPossible) {
        requestIdleCallback(saveToCache);
      } else {
        setTimeout(saveToCache, 1);
      }

      fetched.at = new Date();
      fetched.loading = false;
    };

    const resource: ResourceDataset<Scale, Type> = {
      scale,
      url: baseURL,
      fetch: _fetch,
      fetchedJSONs,
      drop() {
        dispose();
        fetchedJSONs.forEach((fetched) => {
          fetched.at = null;
          fetched.json.set(null);
        });
      },
    };

    return resource;
  });
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

export function chunkIdToIndex(scale: ResourceScale, id: number) {
  return scale === "date" ? id - 2009 : Math.floor(id / HEIGHT_CHUNK_SIZE);
}
