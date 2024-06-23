import { createDateDatasets } from "./date";
import { createHeightDatasets } from "./height";

export const scales = ["date" as const, "height" as const];

export const HEIGHT_CHUNK_SIZE = 10_000;

export function createDatasets({
  setActiveResources,
}: {
  setActiveResources: Setter<Set<ResourceDataset<any, any>>>;
}) {
  return {
    date: createDateDatasets({ setActiveResources }),
    height: createHeightDatasets({ setActiveResources }),
  } satisfies Record<ResourceScale, any>;
}
