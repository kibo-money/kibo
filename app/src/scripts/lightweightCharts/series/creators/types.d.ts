interface BaselineSeriesOptions {
  color?: string;
  topColor?: string;
  topLineColor?: string;
  bottomColor?: string;
  bottomLineColor?: string;
  lineColor?: string;
  base?: number;
  options?: DeepPartialBaselineOptions;
  title?: string;
}

type SeriesLegend = ReturnType<typeof import("./legend").createSeriesLegend>;
