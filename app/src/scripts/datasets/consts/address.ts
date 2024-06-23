export const addressCohortsBySize = [
  {
    key: "plankton",
    name: "Plankton",
  },
  {
    key: "shrimp",
    name: "Shrimp",
  },
  { key: "crab", name: "Crab" },
  { key: "fish", name: "Fish" },
  { key: "shark", name: "Shark" },
  { key: "whale", name: "Whale" },
  { key: "humpback", name: "Humpback" },
  { key: "megalodon", name: "Megalodon" },
] as const;

export const addressCohortsByType = [
  { key: "p2pk", name: "P2PK" },
  { key: "p2pkh", name: "P2PKH" },
  { key: "p2sh", name: "P2SH" },
  { key: "p2wpkh", name: "P2WPKH" },
  { key: "p2wsh", name: "P2WSH" },
  { key: "p2tr", name: "P2TR" },
] as const;

export const addressCohorts = [
  ...addressCohortsBySize,
  ...addressCohortsByType,
] as const;
