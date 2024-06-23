import groupedKeysToPath from "/src/../../datasets/grouped_keys_to_url_path.json";

import { createResourceDataset } from "./resource";

export function createHeightDatasets({
  setActiveResources,
}: {
  setActiveResources: Setter<Set<ResourceDataset<any, any>>>;
}) {
  type Key = keyof typeof groupedKeysToPath.height;
  type ResourceData = ReturnType<typeof createResourceDataset<"height">>;

  const resourceDatasets = {} as Record<Exclude<Key, "ohlc">, ResourceData>;

  Object.keys(groupedKeysToPath.height).forEach(([_key, path]) => {
    const key = _key as Key;
    if (key !== "ohlc") {
      resourceDatasets[key] = createResourceDataset<"height">({
        scale: "height",
        path,
        setActiveResources,
      });
    }
  });

  const price = createResourceDataset<"height", OHLC>({
    scale: "height",
    path: "/height-to-ohlc",
    setActiveResources,
  });

  return {
    ...resourceDatasets,
    price,
  };
}
