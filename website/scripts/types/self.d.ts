import {
  Accessor,
  Setter,
} from "../../packages/solid-signals/2024-11-02/types/signals";
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
  SeriesType,
  ISeriesApi,
  BaselineData,
} from "../../packages/lightweight-charts/v4.2.0/types";
import { DatePath, HeightPath, LastPath } from "./paths";
import { AnyPossibleCohortId } from "../options";
import { Signal } from "../../packages/solid-signals/types";

type GrowToSize<T, N extends number, A extends T[]> = A["length"] extends N
  ? A
  : GrowToSize<T, N, [...A, T]>;

type FixedArray<T, N extends number> = GrowToSize<T, N, []>;

type TimeScale = "date" | "height";

type TimeRange = Range<Time | number>;

type DatasetPath<Scale extends TimeScale> = Scale extends "date"
  ? DatePath
  : HeightPath;

type AnyDatasetPath = import("./paths").DatePath | import("./paths").HeightPath;

type AnyPath = AnyDatasetPath | LastPath;

type Color = () => string;
type ColorName = keyof Colors;

type Unit =
  | ""
  | "Bitcoin"
  | "Coinblocks"
  | "Count"
  | "Date"
  | "Dollars / (PetaHash / Second)"
  | "ExaHash / Second"
  | "Height"
  | "Gigabytes"
  | "Megabytes"
  | "Percentage"
  | "Ratio"
  | "Satoshis"
  | "Seconds"
  | "Transactions"
  | "US Dollars"
  | "Virtual Bytes"
  | "Weight";

interface PartialOption {
  name: string;
}

interface PartialHomeOption extends PartialOption {
  kind: "home";
  title: "Home";
  name: "Home";
}

interface PartialLivePriceOption extends PartialOption {
  kind: "live-price";
}

interface PartialMoscowTimeOption extends PartialOption {
  kind: "moscow-time";
}

interface PartialConverterOption extends PartialOption {
  kind: "converter";
}

interface PartialChartOption extends PartialOption {
  scale: TimeScale;
  title: string;
  shortTitle?: string;
  unit: Unit;
  description: string;
  top?: SplitSeriesBlueprint[];
  bottom?: SplitSeriesBlueprint[];
  dashboard?: {
    ignoreName?: boolean;
    skip?: boolean;
  };
}

interface PartialSimulationOption extends PartialOption {
  kind: "simulation";
  title: string;
  name: string;
}

interface PartialPdfOption extends PartialOption {
  pdf: string;
}

interface PartialUrlOption extends PartialOption {
  qrcode?: true;
  url: () => string;
}

interface PartialOptionsGroup {
  name: string;
  tree: PartialOptionsTree;
}

type AnyPartialOption =
  | PartialHomeOption
  | PartialLivePriceOption
  | PartialMoscowTimeOption
  | PartialConverterOption
  | PartialChartOption
  | PartialSimulationOption
  | PartialPdfOption
  | PartialUrlOption;

type PartialOptionsTree = (AnyPartialOption | PartialOptionsGroup)[];

interface ProcessedOptionAddons {
  id: string;
  path: OptionPath;
  serializedPath: string;
  title: string;
}

type OptionPath = {
  id: string;
  name: string;
}[];

type HomeOption = PartialHomeOption & ProcessedOptionAddons;
type SimulationOption = PartialSimulationOption & ProcessedOptionAddons;
type LivePriceOption = PartialLivePriceOption & ProcessedOptionAddons;
type MoscowTimeOption = PartialMoscowTimeOption & ProcessedOptionAddons;
type ConverterOption = PartialConverterOption & ProcessedOptionAddons;

interface PdfOption extends PartialPdfOption, ProcessedOptionAddons {
  kind: "pdf";
}

interface UrlOption extends PartialUrlOption, ProcessedOptionAddons {
  kind: "url";
}

interface ChartOption extends PartialChartOption, ProcessedOptionAddons {
  kind: "chart";
}

type Option =
  | HomeOption
  | LivePriceOption
  | MoscowTimeOption
  | ConverterOption
  | PdfOption
  | UrlOption
  | ChartOption
  | SimulationOption;

type OptionsTree = (Option | OptionsGroup)[];

interface OptionsGroup extends PartialOptionsGroup {
  id: string;
  tree: OptionsTree;
}

interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ResourceDataset<
  Scale extends TimeScale,
  Type extends OHLC | number = number,
> {
  scale: Scale;
  url: string;
  fetch: (id: number) => Promise<void>;
  fetchRange: (start: number, end: number) => Promise<void[]>;
  fetchedJSONs: FetchedResult<Scale, Type>[];
}

type ValuedCandlestickData = CandlestickData & Valued;

interface FetchedResult<
  Scale extends TimeScale,
  Type extends number | OHLC,
  Value extends SingleValueData | ValuedCandlestickData = Type extends number
    ? SingleValueData
    : ValuedCandlestickData,
> {
  at: Date | null;
  json: Signal<FetchedJSON<Scale, Type> | null>;
  vec: Accessor<Value[] | null>;
  loading: boolean;
}

interface Valued {
  value: number;
}

type DatasetValue<T> = T & Valued;

interface FetchedJSON<Scale extends TimeScale, Type extends number | OHLC> {
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
  Scale extends TimeScale,
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

interface Weighted {
  weight: number;
}

type DatasetCandlestickData = DatasetValue<CandlestickData> & { year: number };

type NotFunction<T> = T extends Function ? never : T;

type Groups = import("../options").Groups;

type DefaultCohortOption = CohortOption<AnyPossibleCohortId>;

interface CohortOption<Id extends AnyPossibleCohortId> {
  scale: TimeScale;
  name: string;
  title: string;
  datasetId: Id;
  color: Color;
  filenameAddon?: string;
}

type DefaultCohortOptions = CohortOptions<AnyPossibleCohortId>;

interface CohortOptions<Id extends AnyPossibleCohortId> {
  scale: TimeScale;
  name: string;
  title: string;
  list: CohortOption<Id>[];
}

interface RatioOption {
  scale: TimeScale;
  color: Color;
  valueDatasetPath: AnyDatasetPath;
  ratioDatasetPath: AnyDatasetPath;
  title: string;
}

interface RatioOptions {
  scale: TimeScale;
  title: string;
  list: RatioOption[];
}

interface Frequency {
  name: string;
  value: string;
  isTriggerDay: (date: Date) => boolean;
}
type Frequencies = { name: string; list: Frequency[] };

type LastValues = Record<LastPath, number> | null;
