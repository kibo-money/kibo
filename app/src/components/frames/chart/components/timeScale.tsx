import { GENESIS_DAY } from "/src/scripts/lightweightCharts/whitespace";
import { ONE_DAY_IN_MS } from "/src/scripts/utils/time";
import { classPropToString } from "/src/solid/classes";
import { createRWS } from "/src/solid/rws";

import { Box } from "../../box";
import { Scrollable } from "../../scrollable";

const DELAY = 1;
const MULTIPLIER = DELAY / 1000;
const LEFT = -1;
const RIGHT = 1;

export function TimeScale({
  scale,
  firstChart,
}: {
  scale: Accessor<ResourceScale>;
  firstChart: RWS<IChartApi | undefined>;
}) {
  const today = new Date();

  const disabled = createMemo(() => !firstChart());

  const scrollDirection = createRWS(0);

  const timeScale = createMemo(() => {
    const chart = firstChart();
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
    <Box padded={false} spaced={false} classes="short:hidden text-sm">
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
            fallback={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="size-5"
              >
                <path d="M8.5 4.75a.75.75 0 0 0-1.107-.66l-6 3.25a.75.75 0 0 0 0 1.32l6 3.25a.75.75 0 0 0 1.107-.66V8.988l5.393 2.921A.75.75 0 0 0 15 11.25v-6.5a.75.75 0 0 0-1.107-.66L8.5 7.013V4.75Z" />
              </svg>
            }
          >
            <IconTablerPlayerPauseFilled class="size-5" />
          </Show>
        </Button>
      </div>
      <div class="mr-2 border-l" />
      <Scrollable classes="space-x-2">
        <Switch>
          <Match when={scale() === "date"}>
            <Button
              minWidth
              disabled={disabled}
              onClick={() => setTimeScale({ scale: scale(), timeScale })}
            >
              All Time
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), timeScale, days: 7 })
              }
            >
              1 Week
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), timeScale, days: 30 })
              }
            >
              1 Month
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), timeScale, days: 3 * 30 })
              }
            >
              3 Months
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), timeScale, days: 6 * 30 })
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
                  timeScale,
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
                setTimeScale({ scale: scale(), timeScale, days: 365 })
              }
            >
              1 Year
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), timeScale, days: 2 * 365 })
              }
            >
              2 Years
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), timeScale, days: 4 * 365 })
              }
            >
              4 Years
            </Button>
            <Button
              minWidth
              disabled={disabled}
              onClick={() =>
                setTimeScale({ scale: scale(), timeScale, days: 8 * 365 })
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
                  onClick={() =>
                    setTimeScale({ scale: scale(), timeScale, year })
                  }
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
                      timeScale,
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
      <div class="ml-2 border-l" />
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
            fallback={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="size-5"
              >
                <path d="M2.53 3.956A1 1 0 0 0 1 4.804v6.392a1 1 0 0 0 1.53.848l5.113-3.196c.16-.1.279-.233.357-.383v2.73a1 1 0 0 0 1.53.849l5.113-3.196a1 1 0 0 0 0-1.696L9.53 3.956A1 1 0 0 0 8 4.804v2.731a.992.992 0 0 0-.357-.383L2.53 3.956Z" />
              </svg>
            }
          >
            <IconTablerPlayerPauseFilled class="size-5" />
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
        !disabled?.() && "active:scale-95",
        "flex-shrink-0 flex-grow whitespace-nowrap p-1.5 font-medium",
      ])}
      onClick={onClick}
      disabled={disabled?.()}
    >
      {children}
    </button>
  );
}

function setTimeScale({
  timeScale,
  scale,
  days,
  year,
  range,
}: {
  timeScale: Accessor<ITimeScaleApi<Time> | undefined>;
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

    timeScale()?.setVisibleRange({
      from: (from.getTime() / 1000) as Time,
      to: (to.getTime() / 1000) as Time,
    });
  } else if (scale === "height") {
    if (range) {
      timeScale()?.setVisibleRange({
        from: range.from as Time,
        to: range.to as Time,
      });
    }
  }
}
