import { chartState } from "/src/scripts/lightweightCharts/chart/state";
import { GENESIS_DAY } from "/src/scripts/lightweightCharts/chart/whitespace";
import { ONE_DAY_IN_MS } from "/src/scripts/utils/time";

import { Box } from "../../box";

export function TimeScale() {
  const today = new Date();

  return (
    <Box dark padded overflowY classes="short:hidden">
      <Button onClick={() => setTimeScale({})}>All Time</Button>
      <Button onClick={() => setTimeScale({ days: 7 })}>1 Week</Button>
      <Button onClick={() => setTimeScale({ days: 30 })}>1 Month</Button>
      <Button onClick={() => setTimeScale({ days: 30 * 6 })}>6 Months</Button>
      <Button
        onClick={() =>
          setTimeScale({
            days: Math.ceil(
              (today.valueOf() -
                new Date(`${today.getUTCFullYear()}-01-01`).valueOf()) /
                ONE_DAY_IN_MS,
            ),
          })
        }
      >
        Year To Date
      </Button>
      <Button onClick={() => setTimeScale({ days: 365 })}>1 Year</Button>
      <Button onClick={() => setTimeScale({ days: 2 * 365 })}>2 Years</Button>
      <Button onClick={() => setTimeScale({ days: 4 * 365 })}>4 Years</Button>
      <Button onClick={() => setTimeScale({ days: 8 * 365 })}>8 Years</Button>
      <For
        each={new Array(
          new Date().getFullYear() - new Date("2009-01-01").getFullYear(),
        )
          .fill(0)
          .map((_, index) => index + 2009)
          .reverse()}
      >
        {(year) => (
          <Button onClick={() => setTimeScale({ year })}>{year}</Button>
        )}
      </For>
    </Box>
  );
}

function Button(props: ParentProps & { onClick: VoidFunction }) {
  return (
    <button
      class="min-w-20 flex-shrink-0 flex-grow whitespace-nowrap rounded-lg px-2 py-1.5 hover:bg-white/20 active:scale-95"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

function setTimeScale({ days, year }: { days?: number; year?: number }) {
  let from = new Date();
  let to = new Date();

  if (year) {
    from = new Date(`${year}-01-01`);
    to = new Date(`${year}-12-31`);
  } else if (days) {
    from.setDate(from.getUTCDate() - days);
  } else {
    from = new Date(GENESIS_DAY);
  }

  setRange({
    from: (from.getTime() / 1000) as Time,
    to: (to.getTime() / 1000) as Time,
  });
}

function setRange(range: TimeRange) {
  chartState.chart?.timeScale().setVisibleRange(range);
}
