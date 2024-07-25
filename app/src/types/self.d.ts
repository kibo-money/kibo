interface Valued {
  value: number;
}

type DatasetCandlestickData = DatasetValue<CandlestickData> & { year: number };
