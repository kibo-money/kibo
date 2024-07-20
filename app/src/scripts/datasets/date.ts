import { createResourceDataset } from "./resource";

export { averages } from "./consts/averages";

export function createDateDatasets({
  groupedKeysToURLPath,
}: {
  groupedKeysToURLPath: GroupedKeysToURLPath["date"];
}) {
  type Key = keyof typeof groupedKeysToURLPath;
  type ResourceData = ReturnType<typeof createResourceDataset<"date">>;

  type ResourceDatasets = Record<Exclude<Key, "price">, ResourceData>;

  const datasets = groupedKeysToURLPath as any as ResourceDatasets;

  for (const key in groupedKeysToURLPath) {
    if ((key as Key) !== "price") {
      datasets[key as Exclude<Key, "price">] = createResourceDataset<"date">({
        scale: "date",
        path: groupedKeysToURLPath[key as Key],
      });
    }
  }

  const price = createResourceDataset<"date", OHLC>({
    scale: "date",
    path: "/date-to-price",
  });

  Object.assign(datasets, { price });

  return datasets as ResourceDatasets & {
    price: ResourceDataset<"date", OHLC>;
  };
}
