import { createResourceDataset } from "./resource";

export const scales = ["date" as const, "height" as const];

export const HEIGHT_CHUNK_SIZE = 10_000;

export function createDatasets() {
  const date = new Map<DateDatasetPath, ResourceDataset<"date">>();
  const height = new Map<HeightDatasetPath, ResourceDataset<"height">>();

  function getOrImport<Scale extends ResourceScale>(
    scale: Scale,
    path: DatasetPath<Scale>,
  ): ResourceDataset<Scale> {
    if (scale === "date") {
      const found = date.get(path as any);
      if (found) return found as ResourceDataset<Scale>;
    } else {
      const found = height.get(path as any);
      if (found) return found as ResourceDataset<Scale>;
    }

    let dataset: ResourceDataset<Scale, any>;

    if (path === `/${scale}-to-price`) {
      dataset = createResourceDataset<Scale, OHLC>({
        scale,
        path,
      });
    } else {
      dataset = createResourceDataset<Scale>({
        scale,
        path,
      });
    }

    if (scale === "date") {
      date.set(path as any, dataset as any);
    } else {
      height.set(path as any, dataset as any);
    }

    return dataset;
  }

  return {
    getOrImport,
  };
}
