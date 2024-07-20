import { createResourceDataset } from "./resource";

export function createHeightDatasets({
  groupedKeysToURLPath,
}: {
  groupedKeysToURLPath: GroupedKeysToURLPath["height"];
}) {
  type Key = keyof typeof groupedKeysToURLPath;
  type ResourceData = ReturnType<typeof createResourceDataset<"height">>;

  type ResourceDatasets = Record<Exclude<Key, "price">, ResourceData>;

  const datasets = groupedKeysToURLPath as any as ResourceDatasets;

  for (const key in groupedKeysToURLPath) {
    if ((key as Key) !== "price") {
      datasets[key as Exclude<Key, "price">] = createResourceDataset<"height">({
        scale: "height",
        path: groupedKeysToURLPath[key as Key],
      });
    }
  }

  const price = createResourceDataset<"height", OHLC>({
    scale: "height",
    path: "/height-to-price",
  });

  Object.assign(datasets, { price });

  return datasets as ResourceDatasets & {
    price: ResourceDataset<"height", OHLC>;
  };
}
