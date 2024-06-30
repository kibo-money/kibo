import { GENESIS_DAY } from "/src/scripts/lightweightCharts/chart/whitespace";
import { ONE_DAY_IN_MS } from "/src/scripts/utils/time";
import { classPropToString } from "/src/solid/classes";

import { Box } from "../../box";
import { Scrollable } from "../../scrollable";

export function TimeScale({ charts }: { charts: RWS<IChartApi[]> }) {
  const today = new Date();

  const disabled = createMemo(() => charts().length === 0);

  return (
    <Box dark padded={false} classes="short:hidden">
      <Scrollable classes="p-1.5 space-x-2">
        <Button disabled={disabled} onClick={() => setTimeScale({ charts })}>
          All Time
        </Button>
        <Button
          disabled={disabled}
          onClick={() => setTimeScale({ charts, days: 7 })}
        >
          1 Week
        </Button>
        <Button
          disabled={disabled}
          onClick={() => setTimeScale({ charts, days: 30 })}
        >
          1 Month
        </Button>
        <Button
          disabled={disabled}
          onClick={() => setTimeScale({ charts, days: 3 * 30 })}
        >
          3 Months
        </Button>
        <Button
          disabled={disabled}
          onClick={() => setTimeScale({ charts, days: 6 * 30 })}
        >
          6 Months
        </Button>
        <Button
          disabled={disabled}
          onClick={() =>
            setTimeScale({
              charts,
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
        <Button
          disabled={disabled}
          onClick={() => setTimeScale({ charts, days: 365 })}
        >
          1 Year
        </Button>
        <Button
          disabled={disabled}
          onClick={() => setTimeScale({ charts, days: 2 * 365 })}
        >
          2 Years
        </Button>
        <Button
          disabled={disabled}
          onClick={() => setTimeScale({ charts, days: 4 * 365 })}
        >
          4 Years
        </Button>
        <Button
          disabled={disabled}
          onClick={() => setTimeScale({ charts, days: 8 * 365 })}
        >
          8 Years
        </Button>
        <For
          each={new Array(
            new Date().getFullYear() - new Date("2009-01-01").getFullYear(),
          )
            .fill(0)
            .map((_, index) => index + 2009)
            .reverse()}
        >
          {(year) => (
            <Button
              disabled={disabled}
              onClick={() => setTimeScale({ charts, year })}
            >
              {year}
            </Button>
          )}
        </For>
      </Scrollable>
    </Box>
  );
}

function Button({
  onClick,
  disabled,
  children,
}: ParentProps & { onClick: VoidFunction; disabled: Accessor<boolean> }) {
  return (
    <button
      class={classPropToString([
        disabled() ? "opacity-50" : "hover:bg-orange-50/20 active:scale-95",
        "min-w-20 flex-shrink-0 flex-grow whitespace-nowrap rounded-lg px-2 py-1.5",
      ])}
      onClick={onClick}
      disabled={disabled()}
    >
      {children}
    </button>
  );
}

function setTimeScale({
  charts,
  days,
  year,
}: {
  charts: RWS<IChartApi[]>;
  days?: number;
  year?: number;
}) {
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

  charts()[0]
    .timeScale()
    .setVisibleRange({
      from: (from.getTime() / 1000) as Time,
      to: (to.getTime() / 1000) as Time,
    });
}
