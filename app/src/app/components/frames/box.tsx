import { createResizeObserver } from "@solid-primitives/resize-observer";

import { classPropToString } from "/src/solid/classes";
import { createRWS } from "/src/solid/rws";

export function Box({
  flex = true,
  absolute,
  padded = true,
  children,
  dark,
  overflowY,
}: {
  flex?: boolean;
  absolute?: "top" | "bottom";
  padded?: boolean;
  dark?: boolean;
  overflowY?: boolean;
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
    const offset = 20;

    const target = maybeScrollable()!;

    const left = target.scrollLeft;
    const right = target.scrollWidth - target.scrollLeft - target.clientWidth;

    showLeftArrow.set(() => left > offset);
    showRightArrow.set(() => right > offset);
  }

  return (
    <div
      class={classPropToString([
        "p-2",
        absolute
          ? [
              "absolute inset-x-0",
              absolute === "top"
                ? "top-0"
                : "pointer-events-none bottom-0 bg-gradient-to-b from-transparent to-black",
            ]
          : "relative",
      ])}
    >
      <div
        class={classPropToString([
          "pointer-events-auto relative overflow-hidden rounded-xl border border-orange-200/10 shadow-md",
          dark
            ? "bg-orange-100/5 backdrop-blur-sm"
            : "bg-orange-200/10 backdrop-blur-md",
        ])}
      >
        <For
          each={[
            {
              showArrow: showLeftArrow,
              side: "left-0",
              order: "",
              buttonPadding: "pl-3 pr-2",
              iconPadding: "pr-0.5",
              scrollMultiplier: -1,
              chevronIcon: IconTablerChevronLeft,
              gradientDirection: "bg-gradient-to-r",
            },
            {
              showArrow: showRightArrow,
              side: "right-0",
              order: "order-2",
              buttonPadding: "pl-2 pr-3",
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
                  "pointer-events-none absolute bottom-0 top-0 z-20 flex transition-opacity duration-200 ease-in-out",
                ].join(" ")}
              >
                <div
                  class={[
                    obj.order,
                    obj.buttonPadding,
                    "pointer-events-auto hidden h-full items-center bg-black/90 md:flex",
                  ].join(" ")}
                >
                  <button
                    onClick={() => {
                      maybeScrollable()?.scrollBy({
                        left: Math.floor(
                          maybeScrollable()!.clientWidth *
                            obj.scrollMultiplier *
                            0.8,
                        ),
                        behavior: "smooth",
                      });
                    }}
                    class="rounded-full border border-orange-200/20 bg-black p-0.5 transition hover:scale-110 active:scale-100"
                  >
                    <Dynamic
                      component={obj.chevronIcon}
                      class={[`size-5 ${obj.iconPadding}`]}
                    />
                  </button>
                </div>
                <div
                  class={[
                    obj.gradientDirection,
                    "h-full w-10 from-black/90 to-transparent",
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
            flex && "flex w-full space-x-2",
            overflowY && "overflow-y-auto",
            padded && "p-1.5",
          ])}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
