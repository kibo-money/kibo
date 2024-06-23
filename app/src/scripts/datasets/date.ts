import groupedKeysToPath from "/src/../../datasets/grouped_keys_to_url_path.json";

import { createResourceDataset } from "./resource";

export { averages } from "./consts/averages";

export function createDateDatasets({
  setActiveResources,
}: {
  setActiveResources: Setter<Set<ResourceDataset<any, any>>>;
}) {
  type Key = keyof typeof groupedKeysToPath.date;
  type ResourceData = ReturnType<typeof createResourceDataset<"date">>;

  const resourceDatasets = {} as Record<Exclude<Key, "ohlc">, ResourceData>;

  Object.entries(groupedKeysToPath.date).forEach(([_key, path]) => {
    const key = _key as Key;

    if (key !== "ohlc") {
      resourceDatasets[key] = createResourceDataset<"date">({
        scale: "date",
        path,
        setActiveResources,
      });
    }
  });

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
