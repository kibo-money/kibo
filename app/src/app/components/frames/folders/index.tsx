import { scrollIntoView } from "/src/scripts/utils/scroll";
import { sleep, tick } from "/src/scripts/utils/sleep";
import { createRWS } from "/src/solid/rws";

import { Box } from "../box";
import { Button } from "../button";
import { Header } from "../header";
import { Number } from "../number";
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

  return (
    <div
      class="relative flex size-full flex-1 flex-col"
      style={{
        display: selectedFrame() !== "Folders" ? "none" : undefined,
      }}
    >
      <div class="flex-1 overflow-y-auto">
        <div class="flex max-h-full min-h-0 flex-1 flex-col gap-4 p-4">
          <Header title="Folders">
            <Number number={() => presets.list.length} /> charts organized in a
            tree like structure.
          </Header>

          <div class="border-lighter -mx-4 border-t" />

          <Tree
            tree={presets.tree}
            openedFolders={presets.openedFolders}
            selected={presets.selected}
            selectPreset={presets.select}
            favorites={presets.favorites}
          />

          <div class="h-[50dvh] flex-none" />
        </div>
      </div>

      <Box absolute="bottom">
        <Button
          onClick={() => {
            presets.openedFolders.set((s) => {
              s.clear();
              return s;
            });

            sleep(10);

            scrollIntoView(div());
          }}
        >
          Close all folders
        </Button>
        <Button onClick={() => goToSelected(presets)}>Go to selected</Button>
      </Box>
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
