import groupedKeysToURLPath from "/src/../../datasets/grouped_keys_to_url_path.json";

import { createDateDatasets } from "./date";
import { createHeightDatasets } from "./height";

export const scales = ["date" as const, "height" as const];

export const HEIGHT_CHUNK_SIZE = 10_000;

export function createDatasets({
  setActiveResources,
}: {
  setActiveResources: Setter<Set<ResourceDataset<any, any>>>;
}) {
  const date = createDateDatasets({
    setActiveResources,
    groupedKeysToURLPath: groupedKeysToURLPath.date,
  });

  const height = createHeightDatasets({
    setActiveResources,
    groupedKeysToURLPath: groupedKeysToURLPath.height,
  });

  return {
    date,
    height,
  } satisfies Record<ResourceScale, any>;
}
