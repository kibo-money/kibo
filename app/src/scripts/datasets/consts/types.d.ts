type AgeCohortId = (typeof import("./age").ageCohorts)[number]["id"];

type AgeCohortIdSub = Exclude<AgeCohortId, "">;

type AddressCohortId =
  (typeof import("./address").addressCohorts)[number]["key"];

type LiquidityId = (typeof import("./liquidities").liquidities)[number]["id"];

type AddressCohortIdSplitByLiquidity = `${LiquidityId}-${AddressCohortId}`;

type AnyCohortId = AgeCohortId | AddressCohortId;

type AnyPossibleCohortId =
  | AnyCohortId
  | AddressCohortIdSplitByLiquidity
  | LiquidityId;

type AnyDatasetPrefix =
  | ""
  | `${AgeCohortIdSub | AddressCohortId | AddressCohortIdSplitByLiquidity | LiquidityId}-`;

type AverageName = (typeof import("./averages").averages)[number]["key"];

type TotalReturnKey = (typeof import("./returns").totalReturns)[number]["key"];

type CompoundReturnKey =
  (typeof import("./returns").compoundReturns)[number]["key"];

type PercentileId = (typeof import("./percentiles").percentiles)[number]["id"];
