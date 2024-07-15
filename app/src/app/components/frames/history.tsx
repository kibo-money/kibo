import { run } from "/src/scripts/utils/run";

import { ButtonRandomChart } from "./button";
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
      class="flex-1 overflow-y-auto overflow-x-hidden"
      style={{
        display: selectedFrame() !== "History" ? "none" : undefined,
      }}
    >
      <div class="flex max-h-full min-h-0 flex-1 flex-col p-4">
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
                      presets.history()[index()].date.toJSON().split("T")[0] !==
                        presets
                          .history()
                          [index() - 1].date.toJSON()
                          .split("T")[0]
                    }
                  >
                    <div class="sticky top-[calc(-0.5rem-1px)] z-10 -mx-4 py-2">
                      <div class="border-lighter border-y bg-[#F4EAE3] p-2 dark:bg-[rgb(25,15,15)]">
                        <p class="ml-2">
                          <Switch fallback={date.toLocaleDateString()}>
                            <Match
                              when={
                                new Date().toJSON().split("T")[0] ===
                                date.toJSON().split("T")[0]
                              }
                            >
                              Today
                            </Match>
                            <Match
                              when={
                                run(() => {
                                  const d = new Date();
                                  d.setDate(d.getDate() - 1);
                                  return d;
                                })
                                  .toJSON()
                                  .split("T")[0] === date.toJSON().split("T")[0]
                              }
                            >
                              Yesterday
                            </Match>
                          </Switch>
                        </p>
                      </div>
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
    </div>
  );
}
