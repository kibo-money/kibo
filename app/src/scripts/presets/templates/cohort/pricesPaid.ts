import { percentiles } from "/src/scripts/datasets/consts/percentiles";

import { datasetIdToPrefix } from "./utils";

export function createCohortPresetPricesPaidFolder({
  scale,
  color,
  datasetId,
  title,
}: {
  scale: ResourceScale;
  datasetId: AnyPossibleCohortId;
  title: string;
  color: Color;
}): PartialPresetFolder {
  return {
    name: "Prices Paid",
    tree: [
      {
        scale,
        name: `Average`,
        title: `${title} Average Price Paid - Realized Price`,
        description: "",
        unit: "US Dollars",
        icon: () => IconTablerMathAvg,
        top: [
          {
            title: "Average",
            color,
            datasetPath: `${scale as ResourceScale}-to-${datasetIdToPrefix(datasetId)}realized-price`,
          },
        ],
      },
      {
        scale,
        name: `Deciles`,
        title: `${title} deciles`,
        icon: () => IconTablerSquareHalf,
        description: "",
        unit: "US Dollars",
        top: percentiles
          .filter(({ value }) => Number(value) % 10 === 0)
          .map(({ name, id }) => {
            const datasetPath = generatePath(scale, datasetId, id);

            return {
              datasetPath,
              color,
              title: name,
            };
          }),
      },
      ...percentiles.map(
        (percentile): PartialPreset => ({
          scale,
          name: percentile.name,
          title: `${title} ${percentile.title}`,
          description: "",
          unit: "US Dollars",
          icon: () => IconTablerSquareHalf,
          top: [
            {
              title: percentile.name,
              color,
              datasetPath: generatePath(scale, datasetId, percentile.id),
            },
          ],
        }),
      ),
    ],
  };
}

function generatePath(
  scale: ResourceScale,
  cohortId: AnyPossibleCohortId,
  id: PercentileId,
): AnyDatasetPath {
  const datasetPrefix = datasetIdToPrefix(cohortId);

  return `${scale}-to-${datasetPrefix}${id}` as const;
}
