import { File } from "./file";
import { Folder } from "./folder";

export function Tree({
  tree,
  selected,
  openedFolders,
  depth = 0,
  visible,
  selectPreset,
  path = [],
  favorites,
  filter,
}: {
  tree: PresetTree;
  selected: Accessor<Preset>;
  selectPreset(preset: Preset): void;
  openedFolders: RWS<Set<string>>;
  depth?: number;
  visible?: Accessor<boolean>;
  path?: FilePath;
  favorites: Accessor<Preset[]>;
  filter: (preset: Preset) => boolean;
}) {
  return (
    <Show when={visible?.() || !visible}>
      <div>
        <For each={tree}>
          {(thing) => {
            const active = createMemo(() => thing.id === selected().id);
            const favorite = createMemo(() =>
              favorites().includes(thing as Preset),
            );
            const visited = (thing as Preset).visited;

            if (!("tree" in thing)) {
              return (
                <Show when={filter(thing)}>
                  <File
                    id={thing.id}
                    name={thing.name}
                    active={active}
                    depth={depth}
                    icon={thing.icon || IconTablerFile}
                    favorite={favorite}
                    visited={visited}
                    onClick={() => {
                      const selectedId = selected().id;

                      if (selectedId === thing.id) {
                        return;
                      }

                      // Has been filled in createPresets
                      selectPreset(thing as Preset);
                    }}
                  />
                </Show>
              );
            }

            const childrenVisible = createMemo(() =>
              openedFolders().has(thing.id),
            );

            const childCount = countChildren(thing, filter);

            return (
              <Show when={childCount}>
                <div>
                  <Folder
                    id={thing.id}
                    name={thing.name}
                    depth={depth}
                    open={childrenVisible}
                    children={childCount}
                    onClick={() => {
                      openedFolders.set((s) => {
                        if (childrenVisible()) {
                          s.delete(thing.id);
                        } else {
                          s.add(thing.id);
                        }

                        return s;
                      });
                    }}
                  />
                  <Tree
                    tree={thing.tree}
                    selected={selected}
                    depth={depth + 1}
                    openedFolders={openedFolders}
                    visible={childrenVisible}
                    path={[...path, { name: thing.name, id: thing.id }]}
                    selectPreset={selectPreset}
                    favorites={favorites}
                    filter={filter}
                  />
                </div>
              </Show>
            );
          }}
        </For>
      </div>
    </Show>
  );
}

function countChildren(
  folder: PresetFolder,
  isOkay: (preset: Preset) => boolean,
) {
  let count = 0;

  function _countChildren(tree: PartialPresetTree) {
    tree.forEach((anyPreset) => {
      if ("tree" in anyPreset) {
        _countChildren(anyPreset.tree);
      } else if (isOkay(anyPreset as Preset)) {
        count += 1;
      }
    });
  }

  _countChildren(folder.tree);

  return count;
}
