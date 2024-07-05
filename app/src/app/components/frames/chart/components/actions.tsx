import { Button } from "./button";

export function Actions({
  presets,
  fullscreen,
  qrcode,
}: {
  presets: Presets;
  qrcode: RWS<string>;
  fullscreen?: RWS<boolean>;
}) {
  const ButtonShare = lazy(() =>
    import("./buttonShare").then((d) => ({ default: d.ButtonShare })),
  );

  return (
    <div class="flex space-x-1 p-1.5">
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
              fullscreen().set((b) => !b);
            }}
            classes="hidden md:block"
          />
        )}
      </Show>

      <ButtonShare qrcode={qrcode} />

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
