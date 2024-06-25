import { createResourceDataset } from "./resource";

export { averages } from "./consts/averages";

export function createScaleDatasets<Scale extends ResourceScale>({
  scale,
  setActiveResources,
  groupedKeysToURLPath,
}: {
  scale: Scale;
  setActiveResources: Setter<Set<ResourceDataset<any, any>>>;
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
        setActiveResources,
      });
    }
  }

  const price = createResourceDataset<Scale, OHLC>({
    scale,
    path: `/${scale}-to-ohlc`,
    setActiveResources,
  });

  Object.assign(datasets, { price });

  return datasets;
}
