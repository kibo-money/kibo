import { generate } from "lean-qr";

import { chartState } from "/src/scripts/lightweightCharts/chart/state";
import { setTimeScale } from "/src/scripts/lightweightCharts/chart/time";
import { classPropToString } from "/src/solid/classes";
import { createRWS } from "/src/solid/rws";

export function Actions({
  presets,
  fullscreen,
  qrcode,
}: {
  presets: Presets;
  qrcode: RWS<string>;
  fullscreen?: RWS<boolean>;
}) {
  return (
    <div class="flex space-x-1">
      <Show when={fullscreen}>
        {(fullscreen) => (
          <Button
            title="Toggle fullscreen"
            icon={() =>
              fullscreen()()
                ? IconTablerLayoutSidebarLeftExpand
                : IconTablerLayoutSidebarRightExpand
            }
            onClick={() => {
              const range = chartState.range;

              fullscreen().set((b) => !b);

              setTimeScale(range);
            }}
            classes="hidden md:block"
          />
        )}
      </Show>

      <Button
        title="Share"
        icon={() => IconTablerShare}
        onClick={() => {
          qrcode.set(() =>
            generate(document.location.href).toDataURL({
              on: [0xff, 0xff, 0xff, 0xff],
              off: [0x00, 0x00, 0x00, 0x00],
            }),
          );
        }}
      />
      <Button
        title="Favorite"
        colors={() =>
          presets.selected().isFavorite()
            ? "text-amber-500 bg-amber-500/15 hover:bg-amber-500/30"
            : ""
        }
        icon={() =>
          presets.selected().isFavorite()
            ? IconTablerStarFilled
            : IconTablerStar
        }
        onClick={() => presets.selected().isFavorite.set((b) => !b)}
      />
    </div>
  );
}

function Button({
  title,
  icon,
  colors,
  onClick,
  disabled,
  classes,
}: {
  title: string;
  icon: () => ValidComponent;
  colors?: () => string;
  onClick: VoidFunction;
  disabled?: () => boolean;
  classes?: string;
}) {
  return (
    <button
      title={title}
      disabled={disabled?.()}
      class={classPropToString([
        colors?.() || (disabled?.() ? "" : "hover:bg-orange-200/15"),
        !disabled?.() && "group",
        classes,
        "flex-none rounded-lg p-2 disabled:opacity-50",
      ])}
      onClick={onClick}
    >
      <Dynamic
        component={icon()}
        class="size-[1.125rem] group-active:scale-90"
      />
    </button>
  );
}
