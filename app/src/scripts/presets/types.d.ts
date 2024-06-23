interface PartialPreset {
  scale: ResourceScale;
  icon?: () => JSXElement;
  name: string;
  title: string;
  applyPreset: ApplyPreset;
  description: string;
}

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

type ApplyPreset = (params: {
  chart: IChartApi;
  datasets: Datasets;
  preset: Preset;
  activeResources: Accessor<Set<ResourceDataset<any, any>>>;
}) => ApplyPresetReturn;

type ApplyPresetReturn = PresetLegend;

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
// type PresetList = Preset[];
// type FavoritePresets = Accessor<Preset[]>;

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

type PresetLegend = SeriesLegend[];
