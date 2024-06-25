import { createResourceDataset } from "./resource";

export function createHeightDatasets({
  setActiveResources,
  groupedKeysToURLPath,
}: {
  setActiveResources: Setter<Set<ResourceDataset<any, any>>>;
  groupedKeysToURLPath: GroupedKeysToURLPath["height"];
}) {
  type Key = keyof typeof groupedKeysToURLPath;
  type ResourceData = ReturnType<typeof createResourceDataset<"height">>;

  type ResourceDatasets = Record<Exclude<Key, "ohlc">, ResourceData>;

  const datasets = groupedKeysToURLPath as any as ResourceDatasets;

  for (const key in groupedKeysToURLPath) {
    if ((key as Key) !== "ohlc") {
      datasets[key as Exclude<Key, "ohlc">] = createResourceDataset<"height">({
        scale: "height",
        path: groupedKeysToURLPath[key as Key],
        setActiveResources,
      });
    }
  }

  const price = createResourceDataset<"height", OHLC>({
    scale: "height",
    path: "/height-to-ohlc",
    setActiveResources,
  });

  Object.assign(datasets, { price });

  return datasets as ResourceDatasets & {
    price: ResourceDataset<"height", OHLC>;
  };
}
