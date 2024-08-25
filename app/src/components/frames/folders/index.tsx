import { scrollIntoView } from "/src/scripts/utils/scroll";
import { createSL } from "/src/scripts/utils/selectableList/static";
import { sleep } from "/src/scripts/utils/sleep";
import { tick } from "/src/scripts/utils/tick";
import { createRWS } from "/src/solid/rws";

import { Header } from "../header";
import { RadioGroup } from "../settings";
import { Tree } from "./components/tree";

export function FoldersFrame({
  presets,
  selectedFrame,
}: {
  presets: Presets;
  selectedFrame: Accessor<FrameName>;
}) {
  const div = createRWS<HTMLDivElement | undefined>(undefined);

  onMount(() => {
    goToSelected(presets);
  });

  const filter = createSL(["Any", "Favorites", "New"] as const, {
    defaultIndex: 0,
    selectedIndex: 0,
  });

  return (
    <div
      class="relative flex size-full flex-1 flex-col"
      style={{
        display: selectedFrame() !== "Folders" ? "none" : undefined,
      }}
    >
      <div class="frame">
        <Header title="Folders">Organized in a tree like structure</Header>

        <div class="border-lighter my-2 border-t" />

        <div class="space-y-3">
          <div class="flex items-baseline space-x-6">
            <span class="text-sm">Filter</span>
            <span class="flex-1 self-center border-b" />
            <RadioGroup size="sm" title="Filter" sl={filter} />
          </div>

          <Tree
            tree={presets.tree}
            openedFolders={presets.openedFolders}
            selected={presets.selected}
            selectPreset={presets.select}
            favorites={presets.favorites}
            filter={(preset) => {
              switch (filter.selected()) {
                case "Any":
                  return true;
                case "Favorites":
                  return preset.isFavorite();
                case "New":
                  return !preset.visited();
              }
            }}
          />
        </div>

        <div class="h-[50dvh] flex-none" />
      </div>

      <div class="absolute bottom-0 right-0 flex space-x-4 p-6">
        <button
          class="rounded-full border bg-[var(--background-color)] p-3 active:scale-95"
          style={{
            "box-shadow": "0 0 10px 5px var(--background-color)",
          }}
          onClick={() => {
            presets.openedFolders.set((s) => {
              s.clear();
              return s;
            });

            sleep(10);

            scrollIntoView(div());
          }}
        >
          <IconTablerRestore class="size-5" />
        </button>

        <button
          class="rounded-full border bg-[var(--background-color)] p-3 active:scale-95"
          style={{
            "box-shadow": "0 0 10px 5px var(--background-color)",
          }}
          onClick={() => goToSelected(presets)}
        >
          <IconTablerClick class="size-5" />
        </button>
      </div>
    </div>
  );
}

async function goToSelected(presets: Presets) {
  batch(() =>
    presets.selected().path.forEach(({ id }) => {
      presets.openedFolders.set((s) => {
        s.add(id);
        return s;
      });
    }),
  );

  await tick();

  scrollIntoView(document.getElementById(presets.selected().id), "center");
}
