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

      scrollable.set(() => el.scrollWidth > el.clientWidth);

      checkArrows();
    });
  });

  function checkArrows() {
    const target = maybeScrollable()!;

    const left = target.scrollLeft;
    const right =
      target.scrollWidth - Math.ceil(target.scrollLeft + target.clientWidth);

    showLeftArrow.set(() => left > 0);
    showRightArrow.set(() => right > 0);
  }

  return (
    <div class="relative min-w-0 flex-1">
      <For
        each={[
          {
            showArrow: showLeftArrow,
            side: "left-0",
            order: "",
            buttonPadding: "pl-2",
            iconPadding: "pr-0.5",
            scrollMultiplier: -1,
            chevronIcon: IconTablerChevronLeft,
            gradientDirection: "bg-gradient-to-r",
          },
          {
            showArrow: showRightArrow,
            side: "right-0",
            order: "order-2",
            buttonPadding: "pr-2",
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
                    obj.buttonPadding,
                    "pointer-events-auto flex h-full items-center bg-stone-100/75 dark:bg-stone-900/75",
                  ].join(" ")}
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
                    class="border-light rounded-full border bg-stone-100 p-0.5 shadow transition hover:scale-110 active:scale-100 dark:bg-stone-900"
                  >
                    <Dynamic
                      component={obj.chevronIcon}
                      class={[`size-5 ${obj.iconPadding}`]}
                    />
                  </button>
                </div>
              </Show>
              <div
                class={[
                  obj.gradientDirection,
                  "h-full w-8 from-stone-100/75 to-transparent dark:from-stone-900/75",
                ].join(" ")}
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
