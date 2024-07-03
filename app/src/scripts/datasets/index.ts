import groupedKeysToURLPath from "/src/../../datasets/grouped_keys_to_url_path.json";

import { createDateDatasets } from "./date";
import { createHeightDatasets } from "./height";

export const scales = ["date" as const, "height" as const];

export const HEIGHT_CHUNK_SIZE = 10_000;

export function createDatasets() {
  const date = createDateDatasets({
    groupedKeysToURLPath: groupedKeysToURLPath.date,
  });

  const height = createHeightDatasets({
    groupedKeysToURLPath: groupedKeysToURLPath.height,
  });

  return {
    date,
    height,
  } satisfies Record<ResourceScale, any>;
}
