interface PriceSeriesOptions {
  placement?: "top" | "bottom";
  title?: string;
  id?: string;
  inverseColors?: boolean;
  seriesOptions?: DeepPartial<SeriesOptionsCommon>;
  priceScaleOptions?: DeepPartial<PriceScaleOptions>;
}

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
