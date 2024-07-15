export const addressCohortsBySize = [
  {
    key: "plankton",
    name: "Plankton",
    size: "1 sat to 0.1 BTC",
  },
  {
    key: "shrimp",
    name: "Shrimp",
    size: "0.1 sat to 1 BTC",
  },
  { key: "crab", name: "Crab", size: "1 BTC to 10 BTC" },
  { key: "fish", name: "Fish", size: "10 BTC to 100 BTC" },
  { key: "shark", name: "Shark", size: "100 BTC to 1000 BTC" },
  { key: "whale", name: "Whale", size: "1000 BTC to 10 000 BTC" },
  { key: "humpback", name: "Humpback", size: "10 000 BTC to 100 000 BTC" },
  { key: "megalodon", name: "Megalodon", size: "More than 100 000 BTC" },
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
