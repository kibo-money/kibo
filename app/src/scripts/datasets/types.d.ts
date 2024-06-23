type Datasets = ReturnType<typeof import("./index").createDatasets>;

type DateDatasets = Datasets["date"];
type HeightDatasets = Datasets["height"];
type AnyDatasets = DateDatasets | HeightDatasets;

type ResourceScale = (typeof import("./index").scales)[index];

type DatasetValue<T> = T & Numbered & Valued;

interface Dataset<
  Scale extends ResourceScale,
  Value extends SingleValueData | CandlestickData = SingleValueData,
> {
  scale: Scale;
  values: Accessor<DatasetValue<Value>[]>;
}

interface ResourceDataset<
  Scale extends ResourceScale,
  Type extends OHLC | number = number,
  FetchedDataset extends
    | FetchedDateDataset<Type>
    | FetchedHeightDataset<Type> = Scale extends "date"
    ? FetchedDateDataset<Type>
    : FetchedHeightDataset<Type>,
  Value extends SingleValueData | CandlestickData = Type extends number
    ? SingleValueData
    : CandlestickData,
> extends Dataset<Scale, Value> {
  url: string;
  fetch: (id: number) => void;
  fetchedJSONs: FetchedResult<Scale, Type>[];
  drop: VoidFunction;
}

interface FetchedResult<
  Scale extends ResourceScale,
  Type extends number | OHLC,
  Dataset extends
    | FetchedDateDataset<Type>
    | FetchedHeightDataset<Type> = Scale extends "date"
    ? FetchedDateDataset<Type>
    : FetchedHeightDataset<Type>,
  Value extends DatasetValue<SingleValueData | CandlestickData> = DatasetValue<
    Type extends number ? SingleValueData : CandlestickData
  >,
> {
  at: Date | null;
  json: RWS<FetchedJSON<Scale, Type, Dataset> | null>;
  vec: Accessor<Value[] | null>;
  loading: boolean;
}

interface FetchedJSON<
  Scale extends ResourceScale,
  Type extends number | OHLC,
  Dataset extends
    | FetchedDateDataset<Type>
    | FetchedHeightDataset<Type> = Scale extends "date"
    ? FetchedDateDataset<Type>
    : FetchedHeightDataset<Type>,
> {
  source: FetchedSource;
  chunk: FetchedChunk;
  dataset: FetchedDataset<Scale, Type, Dataset>;
}

type FetchedSource = string;

interface FetchedChunk {
  id: number;
  previous: string | null;
  next: string | null;
}

interface FetchedDataset<
  Scale extends ResourceScale,
  Type extends number | OHLC,
  Dataset extends
    | FetchedDateDataset<Type>
    | FetchedHeightDataset<Type> = Scale extends "date"
    ? FetchedDateDataset<Type>
    : FetchedHeightDataset<Type>,
> {
  version: number;
  map: Dataset;
}

type FetchedDateDataset<T> = Record<string, T>;
type FetchedHeightDataset<T> = T[];

interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
}
