import { ONE_DAY_IN_MS } from "/src/scripts/utils/time";
import { classPropToString } from "/src/solid/classes";
import { createRWS } from "/src/solid/rws";

import { GENESIS_DAY } from "../../../../../scripts/lightweightCharts/whitespace";
import { Box } from "../../box";
import { Scrollable } from "../../scrollable";

const MULTIPLIER = 0.0025;
const DELAY = 25;
const LEFT = -1;
const RIGHT = 1;

export function TimeScale({
  scale,
  charts,
}: {
  scale: Accessor<ResourceScale>;
  charts: RWS<IChartApi[]>;
}) {
  const today = new Date();

  const disabled = createMemo(() => charts().length === 0);

  const scrollDirection = createRWS(0);

  const timeScale = createMemo(() => {
    const chart = charts().at(0);
    if (!chart) return undefined;
    return chart.timeScale();
  });

  let interval: number | undefined;

  function createScrollLoop() {
    clearInterval(interval);
    const direction = scrollDirection();
    if (!direction) return;

    // @ts-ignore
    interval = setInterval(() => {
      const time = timeScale();

      if (!time) return;

      const range = time.getVisibleLogicalRange();

      if (!range) return;

      const speed = (range.to - range.from) * MULTIPLIER * direction;

      // @ts-ignore
      range.from += speed;
      // @ts-ignore
      range.to += speed;

      time.setVisibleLogicalRange(range);
    }, DELAY);
  }

  onCleanup(() => clearInterval(interval));

  return (
    <Box dark padded={false} spaced={false} classes="short:hidden">
      <div class="flex items-center p-1.5">
        <Button
          square
          disabled={disabled}
          onClick={() => {
            scrollDirection.set((v) => (v === LEFT ? 0 : LEFT));
            createScrollLoop();
          }}
        >
          <Show
            when={scrollDirection() === LEFT}
            fallback={<IconTablerPlayerTrackPrevFilled />}
          >
            <IconTablerPlayerPauseFilled />
          </Show>
        </Button>
      </div>
      <div class="border-lighter border-l" />
      <Scrollable classes="p-1.5 space-x-2">
        <Switch>
          <Match when={scale() === "date"}>
            <Button
              minWidth
              disabled={disabled}
              onClick={() => setTimeScale({ scale: scale(), charts })}
            >
              All Time
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() => setTimeScale({ scale: scale(), charts, days: 7 })}
            >
              1 Week
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() => setTimeScale({ scale: scale(), charts, days: 30 })}
            >
              1 Month
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), charts, days: 3 * 30 })
              }
            >
              3 Months
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), charts, days: 6 * 30 })
              }
            >
              6 Months
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({
                  scale: scale(),
                  charts,
                  days: Math.ceil(
                    (today.getTime() -
                      new Date(`${today.getUTCFullYear()}-01-01`).getTime()) /
                      ONE_DAY_IN_MS,
                  ),
                })
              }
            >
              Year To Date
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), charts, days: 365 })
              }
            >
              1 Year
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), charts, days: 2 * 365 })
              }
            >
              2 Years
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), charts, days: 4 * 365 })
              }
            >
              4 Years
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), charts, days: 8 * 365 })
              }
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
                  minWidth
                  disabled={disabled}
                  onClick={() => setTimeScale({ scale: scale(), charts, year })}
                >
                  {year}
                </Button>
              )}
            </For>
          </Match>
          <Match when={scale() === "height"}>
            <Button minWidth disabled={() => true} onClick={() => {}}>
              24h
            </Button>
            <Button minWidth disabled={() => true} onClick={() => {}}>
              48h
            </Button>
            <For
              each={new Array(9)
                .fill(0)
                .flatMap((_, i) => [i, i + 0.5])
                .reverse()}
            >
              {(i) => (
                <Button
                  minWidth
                  disabled={disabled}
                  onClick={() =>
                    setTimeScale({
                      scale: scale(),
                      charts,
                      range: {
                        from: i * 100_000,
                        to: (i + 0.5) * 100_000,
                      },
                    })
                  }
                >
                  {`${100 * (i + 0.5)}k`}
                </Button>
              )}
            </For>
          </Match>
        </Switch>
      </Scrollable>
      <div class="border-lighter border-l" />
      <div class="flex items-center p-1.5">
        <Button
          square
          disabled={disabled}
          onClick={() => {
            scrollDirection.set((v) => (v === RIGHT ? 0 : RIGHT));
            createScrollLoop();
          }}
        >
          <Show
            when={scrollDirection() === RIGHT}
            fallback={<IconTablerPlayerTrackNextFilled />}
          >
            <IconTablerPlayerPauseFilled />
          </Show>
        </Button>
      </div>
    </Box>
  );
}

function Button({
  onClick,
  disabled,
  children,
  minWidth,
  square,
}: ParentProps & {
  onClick: VoidFunction;
  disabled?: Accessor<boolean>;
  minWidth?: boolean;
  square?: boolean;
}) {
  return (
    <button
      class={classPropToString([
        minWidth && "min-w-20",
        square ? "p-2" : "px-2 py-1.5",
        disabled?.()
          ? "text-low-contrast"
          : "hover:bg-orange-50/20 active:scale-95",
        "flex-shrink-0 flex-grow whitespace-nowrap rounded-lg",
      ])}
      onClick={onClick}
      disabled={disabled?.()}
    >
      {children}
    </button>
  );
}

function setTimeScale({
  charts,
  scale,
  days,
  year,
  range,
}: {
  charts: RWS<IChartApi[]>;
  scale: ResourceScale;
  days?: number;
  year?: number;
  range?: { from: number; to: number };
}) {
  if (scale === "date") {
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

    charts()
      .at(0)
      ?.timeScale()
      .setVisibleRange({
        from: (from.getTime() / 1000) as Time,
        to: (to.getTime() / 1000) as Time,
      });
  } else if (scale === "height") {
    if (range) {
      charts()
        .at(0)
        ?.timeScale()
        .setVisibleRange({
          from: range.from as Time,
          to: range.to as Time,
        });
    }
  }
}
