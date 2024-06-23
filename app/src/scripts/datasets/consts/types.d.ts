type AgeCohortKey = (typeof import("./age").ageCohorts)[number]["key"];

type AddressCohortKey =
  (typeof import("./address").addressCohorts)[number]["key"];

type LiquidityKey = (typeof import("./liquidities").liquidities)[number]["key"];

type AddressCohortKeySplitByLiquidity = `${LiquidityKey}_${AddressCohortKey}`;

type AnyCohortKey = AgeCohortKey | AddressCohortKey;

type AnyPossibleCohortKey = AnyCohortKey | AddressCohortKeySplitByLiquidity;

type AverageName = (typeof import("./averages").averages)[number]["key"];

type TotalReturnKey = (typeof import("./returns").totalReturns)[number]["key"];

type CompoundReturnKey =
  (typeof import("./returns").compoundReturns)[number]["key"];
