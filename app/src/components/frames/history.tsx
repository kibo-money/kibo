import { run } from "/src/scripts/utils/run";

import { Box } from "./box";
import { Button, ButtonRandomChart } from "./button";
import { Header } from "./header";
import { Line } from "./line";

export function HistoryFrame({
  presets,
  selectedFrame,
}: {
  presets: Presets;
  selectedFrame: Accessor<FrameName>;
}) {
  return (
    <div
      class="frame"
      style={{
        display: selectedFrame() !== "History" ? "none" : undefined,
      }}
    >
      <div class="flex max-h-full min-h-0 flex-1 flex-col">
        <Header title="History">List of previously visited charts.</Header>

        <div class="space-y-0.5 pt-4">
          <Show
            when={presets.history().length}
            fallback={
              <>
                <div class="border-lighter -mx-4 border-t" />

                <p>
                  You somehow haven't visited by yourself a single chart.
                  Impressive ! You might want to try to{" "}
                  <ButtonRandomChart presets={presets} />
                </p>
              </>
            }
          >
            <For each={presets.history()}>
              {({ preset, date }, index) => (
                <>
                  <Show
                    when={
                      index() === 0 ||
                      presets
                        .history()
                        [index()].date.toLocaleString()
                        .split(",")[0] !==
                        presets
                          .history()
                          [index() - 1].date.toLocaleString()
                          .split(",")[0]
                    }
                  >
                    <div class="sticky top-[calc(-2.0rem-1px)] z-10 py-2">
                      <p
                        class="border-y pb-2 pt-7"
                        style={{
                          background: "var(--background-color)",
                        }}
                      >
                        <Switch
                          fallback={date.toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        >
                          <Match
                            when={
                              new Date().toLocaleString().split(",")[0] ===
                              date.toLocaleString().split(",")[0]
                            }
                          >
                            Today
                          </Match>
                          <Match
                            when={
                              run(() => {
                                const d = new Date();
                                d.setUTCDate(d.getUTCDate() - 1);
                                return d;
                              })
                                .toLocaleString()
                                .split(",")[0] ===
                              date.toLocaleString().split(",")[0]
                            }
                          >
                            Yesterday
                          </Match>
                        </Switch>
                      </p>
                    </div>
                  </Show>
                  <Line
                    id={`history-${preset.id}`}
                    name={preset.title}
                    onClick={() => presets.select(preset)}
                    active={() => presets.selected() === preset}
                    header={date.toLocaleTimeString()}
                  />
                </>
              )}
            </For>
          </Show>
        </div>

        <div class="h-[25dvh] flex-none" />
      </div>

      {/* <Box absolute="bottom">
        <Button
          onClick={() => {
            // search.set("");
            // inputRef()?.focus();
          }}
        >
          Previous day
        </Button>
        <Button
          onClick={() => {
            // search.set("");
            // inputRef()?.focus();
          }}
        >
          Next day
        </Button>
      </Box> */}
    </div>
  );
}
