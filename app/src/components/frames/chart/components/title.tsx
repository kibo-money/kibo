export function Title({ presets }: { presets: Presets }) {
  return (
    <div
      class="flex-0 -mx-6 -mb-4 flex items-center overflow-x-auto px-6 pb-4 pt-1"
      style={{
        "scrollbar-width": "thin",
      }}
    >
      <div class="flex-1 whitespace-nowrap">
        <h1 class="text-lg font-bold md:text-xl">{presets.selected().title}</h1>
        <h3 class="off">{`/ ${[...presets.selected().path.map(({ name }) => name), presets.selected().name].join(" / ")}`}</h3>
      </div>
    </div>
  );
}
