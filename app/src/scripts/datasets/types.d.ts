type Datasets = ReturnType<typeof import("./index").createDatasets>;

type ResourceScale = (typeof import("./index").scales)[index];

type DatasetValue<T> = T & Valued;

interface ResourceDataset<
  Scale extends ResourceScale,
  Type extends OHLC | number = number,
> {
  scale: Scale;
  url: string;
  fetch: (id: number) => void;
  fetchedJSONs: FetchedResult<Scale, Type>[];
  drop: VoidFunction;
}

interface FetchedResult<
  Scale extends ResourceScale,
  Type extends number | OHLC,
  Value extends DatasetValue<SingleValueData | CandlestickData> = DatasetValue<
    Type extends number ? SingleValueData : CandlestickData
  >,
> {
  at: Date | null;
  json: RWS<FetchedJSON<Scale, Type> | null>;
  vec: Accessor<Value[] | null>;
  loading: boolean;
}

interface FetchedJSON<Scale extends ResourceScale, Type extends number | OHLC> {
  source: FetchedSource;
  chunk: FetchedChunk;
  dataset: FetchedDataset<Scale, Type>;
}

type FetchedSource = string;

interface FetchedChunk {
  id: number;
  previous: string | null;
  next: string | null;
}

type FetchedDataset<
  Scale extends ResourceScale,
  Type extends number | OHLC,
> = Scale extends "date"
  ? FetchedDateDataset<Type>
  : FetchedHeightDataset<Type>;

interface Versioned {
  version: number;
}

interface FetchedDateDataset<Type> extends Versioned {
  map: Record<string, Type>;
}

interface FetchedHeightDataset<Type> extends Versioned {
  map: Type[];
}

interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
}

type DatasetPath<Scale extends ResourceScale> = Scale extends "date"
  ? DatePath
  : HeightPath;

type AnyDatasetPath = DatePath | HeightPath;
