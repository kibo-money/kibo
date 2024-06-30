import { createRWS } from "/src/solid/rws";

import { Scrollable } from "../../scrollable";

const transparency = "44";

export function Legend({
  legend: legendList,
}: {
  legend: Accessor<PresetLegend>;
}) {
  const hovering = createRWS<SeriesLegend | undefined>(undefined);

  let toggle = false;

  return (
    <Scrollable classes="flex flex-1 items-center gap-1 p-1.5">
      <For each={legendList()}>
        {(legend) => {
          const initialColors = {} as any;
          const darkenColors = {} as any;

          Object.entries(legend.series.options()).forEach(([k, v]) => {
            if (k.toLowerCase().includes("color") && v) {
              initialColors[k] = v;
              darkenColors[k] = `${v}${transparency}`;
            } else if (k === "lastValueVisible" && v) {
              initialColors[k] = v;
              darkenColors[k] = !v;
            }
          });

          createEffect(() => {
            if (hovering()) {
              if (hovering()?.title !== legend.title) {
                legend.series.applyOptions(darkenColors);
              }
            } else {
              legend.series.applyOptions(initialColors);
            }
          });

          let previousClickValueOf: number = 0;

          return (
            <Show when={!legend.disabled()}>
              <button
                onMouseEnter={() => {
                  if (legend.visible()) {
                    hovering.set(legend);
                  }
                }}
                onMouseLeave={() => hovering.set(undefined)}
                onTouchEnd={() => hovering.set(undefined)}
                onClick={() => {
                  const currentClickValueOf = new Date().valueOf();

                  if (currentClickValueOf - previousClickValueOf > 300) {
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

                  previousClickValueOf = currentClickValueOf;

                  if (legend.visible()) {
                    hovering.set(legend);
                  } else {
                    hovering.set(undefined);
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
                      Array.isArray(legend.color())
                        ? (legend.color() as string[])
                        : [legend.color() as string]
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
                <Show when={legend.url}>
                  {(url) => (
                    <a
                      title="Dataset"
                      class="border-superlight -my-0.5 !-mr-1 inline-flex size-6 flex-col overflow-hidden rounded-full border bg-white bg-opacity-5 p-1 pl-0.5 hover:bg-opacity-50 dark:bg-orange-200 dark:bg-opacity-5 dark:hover:bg-opacity-25"
                      onClick={(event) => {
                        event.stopPropagation();
                        // event.preventDefault();
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
