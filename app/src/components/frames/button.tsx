import { random } from "/src/scripts/utils/math/random";

export function Button({
  onClick,
  children,
}: { onClick: VoidFunction } & ParentProps) {
  return (
    <button
      class="group flex w-full flex-1 items-center justify-center rounded-lg px-2 py-1.5 hover:bg-orange-200/20 active:scale-95"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ButtonRandomChart({ presets }: { presets: Presets }) {
  return (
    <button
      class="inline-flex rounded-md bg-orange-700 bg-opacity-80 px-1.5 py-0.5 font-medium hover:bg-opacity-100 active:scale-95"
      onClick={() => {
        const randomPreset = random(presets.list);
        if (randomPreset) {
          presets.select(randomPreset);
        }
      }}
    >
      Open a random chart
    </button>
  );
}
