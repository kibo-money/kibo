interface PriceSeriesOptions {
  halved?: boolean;
  title?: string;
  id?: string;
  lowerOpacity?: boolean;
  inverseColors?: boolean;
  seriesOptions?: DeepPartial<SeriesOptionsCommon>;
  priceScaleOptions?: DeepPartial<PriceScaleOptions>;
}
