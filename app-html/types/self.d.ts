type Scale = "date" | "height";

import {
  DeepPartial,
  BaselineStyleOptions,
  CandlestickStyleOptions,
  LineStyleOptions,
  SeriesOptionsCommon,
  Range,
  Time,
  SingleValueData,
  CandlestickData,
} from "../libraries/lightweight-charts/types";

type TimeRange = Range<Time | number>;

type AnyDatasetPath = import("./paths").DatePath | import("./paths").HeightPath;

type Color = string;

type SeriesConfig = {
  datasetPath: AnyDatasetPath;
  title: string;
  defaultVisible?: boolean;
} & (
  | {
      color?: Color;
      seriesType: "Based";
      options?: DeepPartial<BaselineStyleOptions & SeriesOptionsCommon>;
    }
  | {
      seriesType: "Candlestick";
      options?: DeepPartial<CandlestickStyleOptions & SeriesOptionsCommon>;
    }
  | {
      seriesType?: "Line";
      options?: DeepPartial<LineStyleOptions & SeriesOptionsCommon>;
    }
);

type Unit =
  | "US Dollars"
  | "Bitcoin"
  | "Percentage"
  | "Height"
  | "Count"
  | "Megabytes"
  | "Transactions"
  | "Weight"
  | "Ratio"
  | "Virtual Bytes"
  | "Seconds"
  | "Coinblocks"
  | "ExaHash / Second"
  | "Dollars / (PetaHash / Second)"
  | "";

interface PresetParams {
  top?: SeriesConfig[];
  bottom?: SeriesConfig[];
}

type PartialPreset = {
  scale: Scale;
  icon: string;
  name: string;
  unit: Unit;
  title: string;
  description: string;
} & PresetParams;

interface PartialPresetFolder {
  name: string;
  tree: PartialPresetTree;
}

type PartialPresetTree = (PartialPreset | PartialPresetFolder)[];

interface Preset extends PartialPreset {
  id: string;
  path: FilePath;
  serializedPath: string;
  isFavorite: Signal<boolean>;
  visited: Signal<boolean>;
}

type PresetTree = (Preset | PresetFolder)[];

interface PresetFolder extends PartialPresetFolder {
  id: string;
  tree: PresetTree;
}

type FilePath = {
  id: string;
  name: string;
}[];

type SerializedPresetsHistory = [string, number][];

interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ResourceDataset<
  S extends Scale,
  Type extends OHLC | number = number
> {
  scale: S;
  url: string;
  fetch: (id: number) => void;
  fetchedJSONs: FetchedResult<S, Type>[];
  drop: VoidFunction;
}

type ValuedCandlestickData = CandlestickData & Valued;

interface FetchedResult<
  S extends Scale,
  Type extends number | OHLC,
  Value extends DatasetValue<
    SingleValueData | ValuedCandlestickData
  > = DatasetValue<
    Type extends number ? SingleValueData : ValuedCandlestickData
  >
> {
  at: Date | null;
  json: Signal<FetchedJSON<S, Type> | null>;
  vec: Accessor<Value[] | null>;
  loading: boolean;
}

interface Valued {
  value: number;
}

type DatasetValue<T> = T & Valued;

interface FetchedJSON<S extends Scale, Type extends number | OHLC> {
  source: FetchedSource;
  chunk: FetchedChunk;
  dataset: FetchedDataset<S, Type>;
}

type FetchedSource = string;

interface FetchedChunk {
  id: number;
  previous: string | null;
  next: string | null;
}

type FetchedDataset<
  S extends Scale,
  Type extends number | OHLC
> = S extends "date" ? FetchedDateDataset<Type> : FetchedHeightDataset<Type>;

interface Versioned {
  version: number;
}

interface FetchedDateDataset<Type> extends Versioned {
  map: Record<string, Type>;
}

interface FetchedHeightDataset<Type> extends Versioned {
  map: Type[];
}
