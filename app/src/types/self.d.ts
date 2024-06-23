interface Dated {
  date: string;
}

interface Heighted {
  height: number;
}

interface Numbered {
  number: number;
}

interface Valued {
  value: number;
}

type DatasetCandlestickData = DatasetValue<CandlestickData>;
