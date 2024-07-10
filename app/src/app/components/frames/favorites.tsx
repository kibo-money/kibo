import { Header } from "./header";
import { Line } from "./line";
import { Number } from "./number";

export function FavoritesFrame({
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
        display: selectedFrame() !== "Favorites" ? "none" : undefined,
      }}
    >
      <div class="flex max-h-full min-h-0 flex-1 flex-col gap-4 p-4">
        <Header title="Favorites">
          <Number number={() => presets.favorites().length} /> presets marked as
          favorites.
        </Header>

        <div class="border-lighter -mx-4 border-t" />

        <div
          class="space-y-0.5 py-1"
          style={{
            display: !presets.favorites().length ? "none" : undefined,
          }}
        >
          <For each={presets.favorites()}>
            {(preset) => (
              <Line
                id={`favorite-${preset.id}`}
                name={preset.title}
                onClick={() => presets.select(preset)}
                active={() => presets.selected() === preset}
                header={`/ ${[...preset.path.map(({ name }) => name), preset.name].join(" / ")}`}
              />
            )}
          </For>
        </div>

        <div class="h-[25dvh] flex-none" />
      </div>
    </div>
  );
}
