import { createCohortPresetPricesPaidFolder } from "./pricesPaid";
import { createCohortPresetRealizedFolder } from "./realized";
import { createCohortPresetSupplyFolder } from "./supply";
import { createCohortPresetUnrealizedFolder } from "./unrealized";
import { createCohortPresetUTXOFolder } from "./utxo";

export function createCohortPresetFolder({
  scale,
  color,
  name,
  datasetId,
  title,
}: {
  scale: ResourceScale;
  name: string;
  datasetId: AnyPossibleCohortId;
  color: Color;
  title: string;
}) {
  return {
    name,
    tree: createCohortPresetList({
      title,
      name,
      scale,
      color,
      datasetId: datasetId,
    }),
  } satisfies PartialPresetFolder;
}

export function createCohortPresetList({
  name,
  scale,
  color,
  datasetId,
  title,
}: {
  name: string;
  scale: ResourceScale;
  datasetId: AnyPossibleCohortId;
  title: string;
  color: Color;
}) {
  return [
    createCohortPresetUTXOFolder({
      color,
      datasetId,
      scale,
      title,
    }),
    createCohortPresetRealizedFolder({
      color,
      datasetId,
      scale,
      title,
    }),
    createCohortPresetUnrealizedFolder({
      color,
      datasetId,
      scale,
      title,
    }),
    createCohortPresetSupplyFolder({
      color,
      datasetId,
      scale,
      title,
    }),
    createCohortPresetPricesPaidFolder({
      color,
      datasetId,
      scale,
      title,
    }),
  ] satisfies PartialPresetTree;
}
