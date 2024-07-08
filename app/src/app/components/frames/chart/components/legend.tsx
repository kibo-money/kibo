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
    <Scrollable classes="items-center gap-1 p-1.5">
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
              <button
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
                class="flex flex-none items-center space-x-1.5 rounded-full py-1.5 pl-2 pr-2.5 hover:bg-orange-800/20 active:scale-[0.975] dark:hover:bg-orange-200/20"
              >
                <span
                  class="flex size-4 flex-col overflow-hidden rounded-full"
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
                  class="text-high-contrast decoration-high-contrast decoration-wavy decoration-[1.5px]"
                  style={{
                    "text-decoration-line": !legend.visible()
                      ? "line-through"
                      : undefined,
                    "--tw-text-opacity": legend.visible() ? 1 : 0.5,
                  }}
                >
                  {legend.title}
                </span>
                <Show when={legend.dataset.url}>
                  {(url) => (
                    <a
                      title="Dataset"
                      class="border-superlight -my-0.5 !-mr-1 inline-flex size-6 flex-col overflow-hidden rounded-full border bg-white bg-opacity-5 p-1 pl-0.5 hover:bg-opacity-50 dark:bg-orange-200 dark:bg-opacity-5 dark:hover:bg-opacity-25"
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
                      <IconTablerExternalLink />
                    </a>
                  )}
                </Show>
              </button>
            </Show>
          );
        }}
      </For>
    </Scrollable>
  );
}
