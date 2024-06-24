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

  for (const _key in groupedKeysToURLPath) {
    const key = _key as Key;

    if (key !== "ohlc") {
      const path = groupedKeysToURLPath[key];

      (groupedKeysToURLPath as any as ResourceDatasets)[key] =
        createResourceDataset<"height">({
          scale: "height",
          path,
          setActiveResources,
        });
    }
  }

  const resourceDatasets = groupedKeysToURLPath as any as ResourceDatasets;

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
