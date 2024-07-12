export function datasetIdToPrefix(
  datasetId: AnyPossibleCohortId,
): AnyDatasetPrefix {
  return datasetId ? (`${datasetId}-` as const) : ("" as const);
}
