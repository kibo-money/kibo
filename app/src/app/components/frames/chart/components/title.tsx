export function Title({ presets }: { presets: Presets }) {
  return (
    <div class="flex flex-1 items-center overflow-y-auto p-1.5">
      <div class="flex-1 -space-y-1 whitespace-nowrap px-1 md:mt-0.5 md:-space-y-1.5">
        <h3 class="text-xs opacity-50">{`/ ${[...presets.selected().path.map(({ name }) => name), presets.selected().name].join(" / ")}`}</h3>
        <h1 class="text-lg font-bold md:text-xl">{presets.selected().title}</h1>
      </div>
    </div>
  );
}
