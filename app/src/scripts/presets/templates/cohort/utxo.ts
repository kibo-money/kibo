import { datasetIdToPrefix } from "./utils";

export function createCohortPresetUTXOFolder({
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
  const datasetPrefix = datasetIdToPrefix(datasetId);

  return {
    name: "UTXOs",
    tree: [
      {
        scale,
        name: `Count`,
        title: `${title} Unspent Transaction Outputs Count`,
        description: "",
        unit: "Count",
        icon: () => IconTablerTicket,
        bottom: [
          {
            title: "Count",
            color,
            datasetPath: `/${scale}-to-${datasetPrefix}utxo-count`,
          },
        ],
      },
    ],
  };
}
