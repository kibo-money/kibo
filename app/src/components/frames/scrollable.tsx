import { createResizeObserver } from "@solid-primitives/resize-observer";

import { touchScreen } from "/src/env";
import { classPropToString } from "/src/solid/classes";
import { createRWS } from "/src/solid/rws";

export function Scrollable({
  children,
  classes,
}: {
  classes?: string;
} & ParentProps) {
  const maybeScrollable = createRWS<HTMLDivElement | undefined>(undefined);
  const scrollable = createRWS(false);
  const showLeftArrow = createRWS(false);
  const showRightArrow = createRWS(false);

  onMount(() => {
    createResizeObserver(maybeScrollable, (_, el) => {
      if (el !== maybeScrollable()) {
        return;
      }

      checkScrollable();
    });
  });

  function checkScrollable() {
    const div = maybeScrollable();

    if (div) {
      scrollable.set(() => div.scrollWidth > div.clientWidth);
    }

    checkArrows();
  }

  function checkArrows() {
    const target = maybeScrollable()!;

    const left = target.scrollLeft;
    const right =
      target.scrollWidth - Math.ceil(target.scrollLeft + target.clientWidth);

    showLeftArrow.set(() => left > 0);
    showRightArrow.set(() => right > 0);
  }

  // @ts-ignore
  createEffect(on(children, checkScrollable));

  return (
    <div class="relative flex min-w-0 flex-grow-0 items-center">
      <For
        each={[
          {
            showArrow: showLeftArrow,
            side: "left-0",
            order: "",
            iconPadding: "pr-0.5",
            scrollMultiplier: -1,
            chevronIcon: IconTablerChevronLeft,
            gradientDirection: "bg-gradient-to-r",
          },
          {
            showArrow: showRightArrow,
            side: "right-0",
            order: "order-2",
            iconPadding: "pl-0.5",
            scrollMultiplier: 1,
            chevronIcon: IconTablerChevronRight,
            gradientDirection: "bg-gradient-to-l",
          },
        ]}
      >
        {(obj) => (
          <Show when={scrollable() && obj.showArrow()}>
            <div
              class={[
                obj.side,
                "pointer-events-none absolute bottom-0 top-0 flex transition-opacity duration-200 ease-in-out",
              ].join(" ")}
            >
              <Show when={!touchScreen}>
                <div
                  class={[
                    obj.order,
                    "pointer-events-auto flex h-full items-center",
                  ].join(" ")}
                  style={{
                    "background-color": "var(--background-color)",
                  }}
                >
                  <button
                    onClick={() => {
                      maybeScrollable()?.scrollBy({
                        left: Math.floor(
                          maybeScrollable()!.clientWidth *
                            obj.scrollMultiplier *
                            0.75,
                        ),
                        behavior: "smooth",
                      });
                    }}
                    class="rounded-full border p-0.5 transition hover:scale-110 active:scale-100"
                    style={{
                      "background-color": "var(--background-color)",
                    }}
                  >
                    <Dynamic
                      component={obj.chevronIcon}
                      class={[`size-5 ${obj.iconPadding}`]}
                    />
                  </button>
                </div>
              </Show>
              <div
                class={classPropToString([
                  obj.gradientDirection,
                  "h-full w-8 from-[var(--background-color)] to-transparent",
                ])}
              />
            </div>
          </Show>
        )}
      </For>

      <div
        ref={maybeScrollable.set}
        onScroll={checkArrows}
        class={classPropToString([
          "no-scrollbar flex w-full overflow-x-auto",
          classes,
        ])}
      >
        {children}
      </div>
    </div>
  );
}
