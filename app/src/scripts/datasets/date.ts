import { createResourceDataset } from "./resource";

export { averages } from "./consts/averages";

export function createDateDatasets({
  setActiveResources,
  groupedKeysToURLPath,
}: {
  setActiveResources: Setter<Set<ResourceDataset<any, any>>>;
  groupedKeysToURLPath: GroupedKeysToURLPath["date"];
}) {
  type Key = keyof typeof groupedKeysToURLPath;
  type ResourceData = ReturnType<typeof createResourceDataset<"date">>;

  type ResourceDatasets = Record<Exclude<Key, "ohlc">, ResourceData>;

  for (const _key in groupedKeysToURLPath) {
    const key = _key as Key;

    if (key !== "ohlc") {
      const path = groupedKeysToURLPath[key];

      (groupedKeysToURLPath as any as ResourceDatasets)[key] =
        createResourceDataset<"date">({
          scale: "date",
          path,
          setActiveResources,
        });
    }
  }

  const resourceDatasets = groupedKeysToURLPath as any as ResourceDatasets;

  const price = createResourceDataset<"date", OHLC>({
    scale: "date",
    path: "/date-to-ohlc",
    setActiveResources,
  });

  const datasets = {
    price,
    ...resourceDatasets,
  };

  return datasets;
}
