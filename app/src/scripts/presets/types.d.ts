interface PresetParams {
  top?: SeriesConfig[];
  bottom?: SeriesConfig[];
}

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

type PartialPreset = {
  scale: ResourceScale;
  icon?: () => JSXElement;
  name: string;
  unit: Unit;
  title: string;
  description: string;
} & PresetParams;

interface Preset extends PartialPreset {
  id: string;
  path: FilePath;
  isFavorite: RWS<boolean>;
  visited: RWS<boolean>;
}

type FilePath = {
  id: string;
  name: string;
}[];

interface PartialPresetFolder {
  name: string;
  tree: PartialPresetTree;
}

interface PresetFolder extends PartialPresetFolder {
  id: string;
  tree: PresetTree;
}

type PartialPresetTree = (PartialPreset | PartialPresetFolder)[];
type PresetTree = (Preset | PresetFolder)[];

type PresetsHistory = { date: Date; preset: Preset }[];
type PresetsHistorySignal = RWS<PresetsHistory>;
type SerializedPresetsHistory = { p: string; d: number }[];

interface Presets {
  tree: (Preset | PresetFolder)[];
  list: Preset[];
  favorites: Accessor<Preset[]>;
  history: PresetsHistorySignal;

  selected: RWS<Preset>;
  openedFolders: RWS<Set<string>>;

  select(preset: Preset): void;
}

type PriceSeriesType = "Candlestick" | "Line";

interface ChartObject {
  scale: ResourceScale;
  div: HTMLDivElement;
  chart: IChartApi;
  whitespace: ISeriesApi<"Line">;
  legendList: SeriesLegend[];
  debouncedSetMinMaxMarkers: VoidFunction;
}

type EnumSeriesType = typeof import("./enums").SeriesType;

type SeriesConfig =
  | {
      // datasetPath: DatasetPath<Scale>;
      datasetPath: AnyDatasetPath;
      color?: Color;
      topColor?: Color;
      bottomColor?: Color;
      colors?: undefined;
      seriesType: EnumSeriesType["Based"];
      title: string;
      options?: BaselineSeriesOptions;
      priceScaleOptions?: DeepPartialPriceScaleOptions;
      defaultVisible?: boolean;
    }
  | {
      // datasetPath: DatasetPath<Scale>;
      datasetPath: AnyDatasetPath;
      color?: Color;
      colors?: Color[];
      seriesType: EnumSeriesType["Histogram"];
      title: string;
      options?: DeepPartialHistogramOptions;
      priceScaleOptions?: DeepPartialPriceScaleOptions;
      defaultVisible?: boolean;
    }
  | {
      // datasetPath: DatasetPath<Scale>;
      datasetPath: AnyDatasetPath;
      seriesType: EnumSeriesType["Candlestick"];
      priceScaleOptions?: DeepPartialPriceScaleOptions;
      colors?: undefined;
      color?: undefined;
      options?: DeepPartialLineOptions;
      defaultVisible?: boolean;
      title: string;
    }
  | {
      // datasetPath: DatasetPath<Scale>;
      datasetPath: AnyDatasetPath;
      color: Color;
      colors?: undefined;
      seriesType?: EnumSeriesType["Line"];
      title: string;
      options?: DeepPartialLineOptions;
      priceScaleOptions?: DeepPartialPriceScaleOptions;
      defaultVisible?: boolean;
    };
