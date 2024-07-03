import { createResourceDataset } from "./resource";

export { averages } from "./consts/averages";

export function createScaleDatasets<Scale extends ResourceScale>({
  scale,
  groupedKeysToURLPath,
}: {
  scale: Scale;
  groupedKeysToURLPath: GroupedKeysToURLPath[Scale];
}) {
  type Key = keyof typeof groupedKeysToURLPath;
  type ResourceData = ReturnType<typeof createResourceDataset<Scale>>;

  type ResourceDatasets = Record<Exclude<Key, "ohlc">, ResourceData>;

  const datasets = groupedKeysToURLPath as any as ResourceDatasets;

  for (const key in groupedKeysToURLPath) {
    if ((key as Key) !== "ohlc") {
      datasets[key as unknown as Exclude<Key, "ohlc">] = createResourceDataset({
        scale,
        path: groupedKeysToURLPath[key as Key] as any,
      });
    }
  }

  const price = createResourceDataset<Scale, OHLC>({
    scale,
    path: `/${scale}-to-ohlc`,
  });

  Object.assign(datasets, { price });

  return datasets;
}
