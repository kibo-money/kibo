interface PriceSeriesOptions {
  placement?: "top" | "bottom";
  title?: string;
  id?: string;
  inverseColors?: boolean;
  seriesOptions?: DeepPartial<SeriesOptionsCommon>;
  priceScaleOptions?: DeepPartial<PriceScaleOptions>;
}
