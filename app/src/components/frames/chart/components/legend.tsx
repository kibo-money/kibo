import { chunkIdToIndex } from "/src/scripts/datasets/resource";
import { createRWS } from "/src/solid/rws";

import { Scrollable } from "../../scrollable";

const transparency = "44";

export function Legend({
  scale,
  legend: legendList,
  dark,
  activeIds,
}: {
  scale: Accessor<ResourceScale>;
  legend: Accessor<SeriesLegend[]>;
  dark: Accessor<boolean>;
  activeIds: Accessor<number[]>;
}) {
  const hovered = createRWS<SeriesLegend | undefined>(undefined);

  let toggle = false;

  return (
    <Scrollable classes="items-center gap-7">
      <For each={legendList()}>
        {(legend) => {
          createEffect(() => {
            const range = activeIds();

            for (let i = 0; i < range.length; i++) {
              const id = range[i];

              const initialColors = {} as any;
              const darkenColors = {} as any;

              const chunkIndex = chunkIdToIndex(scale(), id);

              const series = legend.seriesList.at(chunkIndex)?.();

              if (!series) return;

              const seriesOptions = series.options();

              if (!seriesOptions) continue;

              Object.entries(seriesOptions).forEach(([k, v]) => {
                if (k.toLowerCase().includes("color") && v) {
                  if (typeof v === "string" && !v.startsWith("#")) {
                    return;
                  }

                  v = (v as string).substring(0, 7);
                  initialColors[k] = v;
                  darkenColors[k] = `${v}${transparency}`;
                } else if (k === "lastValueVisible" && v) {
                  initialColors[k] = true;
                  darkenColors[k] = false;
                }
              });

              createEffect((wasHovering: boolean) => {
                const hoveredLegend = hovered();
                const hovering = !!hovered();

                if (wasHovering === hovering) {
                  return hovering;
                }

                if (hoveredLegend) {
                  if (hoveredLegend.title !== legend.title) {
                    series.applyOptions(darkenColors);
                  }
                } else {
                  series.applyOptions(initialColors);
                }

                return hovering;
              }, false);
            }
          });

          let previousClickTime: number = 0;

          return (
            <Show when={!legend.disabled()}>
              <div class="flex flex-none items-center space-x-1.5">
                <button
                  title="Click to toggle, double click to focus"
                  onMouseEnter={() => legend.visible() && hovered.set(legend)}
                  onMouseLeave={() => hovered.set(undefined)}
                  onTouchStart={() => legend.visible() && hovered.set(legend)}
                  onTouchEnd={() => hovered.set(undefined)}
                  onClick={() => {
                    const currentClickTime = new Date().getTime();

                    if (currentClickTime - previousClickTime > 300) {
                      legend.visible.set((visible) => !visible);
                    } else {
                      legendList().forEach((_legend) => {
                        if (_legend.title != legend.title) {
                          _legend.visible.set(toggle);
                        }
                      });

                      legend.visible.set(true);

                      toggle = !toggle;
                    }

                    previousClickTime = currentClickTime;

                    if (legend.visible()) {
                      hovered.set(legend);
                    } else {
                      hovered.set(undefined);
                    }
                  }}
                  class="flex flex-none items-center space-x-1.5 active:scale-[0.975]"
                >
                  <span
                    class="flex size-3 flex-col overflow-hidden rounded-full"
                    style={{
                      opacity: legend.visible() ? 1 : 0.5,
                    }}
                  >
                    <For
                      each={
                        Array.isArray(legend.color)
                          ? legend.color.map((c) => c(dark))
                          : [legend.color(dark)]
                      }
                    >
                      {(color) => (
                        <span
                          class="w-full flex-1"
                          style={{
                            "background-color": color,
                          }}
                        />
                      )}
                    </For>
                  </span>
                  <span
                    class="text-sm font-medium decoration-wavy decoration-[1.5px]"
                    style={{
                      "text-decoration-line": !legend.visible()
                        ? "line-through"
                        : undefined,
                      "text-decoration-color": "var(--color)",
                      color: !legend.visible() ? "var(--off-color)" : undefined,
                    }}
                  >
                    {legend.title}
                  </span>
                </button>
                <Show when={legend.dataset.url}>
                  {(url) => (
                    <a
                      title="Dataset"
                      class="inline-flex size-4 flex-col overflow-hidden active:scale-[0.975]"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      href={url()}
                      target={
                        url()?.startsWith("/") || url()?.startsWith("http")
                          ? "_blank"
                          : undefined
                      }
                    >
                      <IconTablerDownload />
                    </a>
                  )}
                </Show>
              </div>
            </Show>
          );
        }}
      </For>
    </Scrollable>
  );
}
