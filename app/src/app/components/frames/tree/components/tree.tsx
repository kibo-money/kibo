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
}: {
  tree: PresetTree;
  selected: Accessor<Preset>;
  selectPreset(preset: Preset): void;
  openedFolders: RWS<Set<string>>;
  depth?: number;
  visible?: Accessor<boolean>;
  path?: FilePath;
  favorites: Accessor<Preset[]>;
}) {
  return (
    <div style={{ display: visible?.() === false ? "none" : undefined }}>
      <For each={tree}>
        {(thing) => {
          const active = createMemo(() => thing.id === selected().id);
          const favorite = createMemo(() =>
            favorites().includes(thing as Preset),
          );
          const visited = (thing as Preset).visited;

          if (!("tree" in thing)) {
            return (
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
            );
          }

          const childrenVisible = createMemo(() =>
            openedFolders().has(thing.id),
          );

          const childCount = countChildren(thing);

          return (
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
              />
            </div>
          );
        }}
      </For>
    </div>
  );
}

function countChildren(folder: PresetFolder) {
  let count = 0;

  function _countChildren(tree: PartialPresetTree) {
    tree.forEach((anyPreset) => {
      if ("tree" in anyPreset) {
        _countChildren(anyPreset.tree);
      } else {
        count += 1;
      }
    });
  }

  _countChildren(folder.tree);

  return count;
}
