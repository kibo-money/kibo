type IChartApi = import("lightweight-charts").IChartApi;
type SeriesType = import("lightweight-charts").SeriesType;
type ISeriesApi<T extends SeriesType> =
  import("lightweight-charts").ISeriesApi<T>;
type SeriesOptionsMap = import("lightweight-charts").SeriesOptionsMap;
type ISeriesApiAny = ISeriesApi<keyof SeriesOptionsMap>;
type IPriceLine = import("lightweight-charts").IPriceLine;
type ChartOptions = import("lightweight-charts").ChartOptions;
type DeepPartial<T> = import("lightweight-charts").DeepPartial<T>;
type SeriesOptionsCommon = import("lightweight-charts").SeriesOptionsCommon;
type AreaStyleOptions = import("lightweight-charts").AreaStyleOptions;
type BarStyleOptions = import("lightweight-charts").BarStyleOptions;
type BaselineStyleOptions = import("lightweight-charts").BaselineStyleOptions;
type CandlestickStyleOptions =
  import("lightweight-charts").CandlestickStyleOptions;
type HistogramStyleOptions = import("lightweight-charts").HistogramStyleOptions;
type LineStyleOptions = import("lightweight-charts").LineStyleOptions;
type SeriesStylesOptions = DeepPartial<
  (
    | AreaStyleOptions
    | BarStyleOptions
    | BaselineStyleOptions
    | CandlestickStyleOptions
    | HistogramStyleOptions
    | LineStyleOptions
  ) &
    SeriesOptionsCommon
>;
type WhitespaceData = import("lightweight-charts").WhitespaceData;
type SingleValueData = import("lightweight-charts").SingleValueData;
type CandlestickData = import("lightweight-charts").CandlestickData;

type Time = import("lightweight-charts").Time;
type BusinessDay = import("lightweight-charts").BusinessDay;
type SeriesMarker<T> = import("lightweight-charts").SeriesMarker<T>;
type Time = import("lightweight-charts").Time;
type TimeRange = import("lightweight-charts").Range<Time>;
type LogicalRange = import("lightweight-charts").LogicalRange;
type AutoscaleInfo = import("lightweight-charts").AutoscaleInfo;
type BarPrice = import("lightweight-charts").BarPrice;
type MouseEventHandler<HorzScaleItem> =
  import("lightweight-charts").MouseEventHandler<HorzScaleItem>;
type MouseEventParams = import("lightweight-charts").MouseEventParams;
type PriceLineOptions = import("lightweight-charts").PriceLineOptions;
type AutoscaleInfoProvider = import("lightweight-charts").AutoscaleInfoProvider;
type PriceScaleOptions = import("lightweight-charts").PriceScaleOptions;
type LogicalRangeChangeEventHandler =
  import("lightweight-charts").LogicalRangeChangeEventHandler;
type LineData = import("lightweight-charts").LineData;
type AreaData = import("lightweight-charts").AreaData;
type HistogramData = import("lightweight-charts").HistogramData;

type DeepPartialLineOptions = DeepPartial<
  LineStyleOptions & SeriesOptionsCommon
>;

type DeepPartialHistogramOptions = DeepPartial<
  HistogramStyleOptions & SeriesOptionsCommon
>;

type DeepPartialBaselineOptions = DeepPartial<
  BaselineStyleOptions & SeriesOptionsCommon
>;

type DeepPartialChartOptions = DeepPartial<ChartOptions>;
