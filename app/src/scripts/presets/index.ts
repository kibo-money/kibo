import { createRWS } from "/src/solid/rws";

import { colors } from "../utils/colors";
import { replaceHistory } from "../utils/history";
import { stringToId } from "../utils/id";
import { resetURLParams } from "../utils/urlParams";
import { createPresets as createAddressesPresets } from "./addresses";
import { createPresets as createBlocksPresets } from "./blocks";
import { createPresets as createCoinblocksPresets } from "./coinblocks";
import { createPresets as createHodlersPresets } from "./hodlers";
import { createPresets as createMarketPresets } from "./market";
import { createPresets as createMinersPresets } from "./miners";
import { createCohortPresetList } from "./templates/cohort";
import { createPresets as createTransactionsPresets } from "./transactions";

export const LOCAL_STORAGE_FAVORITES_KEY = "favorites";
export const LOCAL_STORAGE_FOLDERS_KEY = "folders";
export const LOCAL_STORAGE_HISTORY_KEY = "history";
export const LOCAL_STORAGE_SELECTED_KEY = "preset";
export const LOCAL_STORAGE_VISITED_KEY = "visited";

export function createPresets(): Presets {
  const partialTree = [
    {
      name: "Dashboards (Coming soon)",
      tree: [],
    },
    {
      name: "Charts",
      tree: [
        {
          name: "By Date",
          tree: [
            createMarketPresets({ scale: "date" }),
            createBlocksPresets(),
            createMinersPresets("date"),
            createTransactionsPresets("date"),
            ...createCohortPresetList({
              scale: "date",
              color: colors.bitcoin,
              datasetKey: "",
              name: "",
              title: "",
            }),
            createHodlersPresets({ scale: "date" }),
            createAddressesPresets({ scale: "date" }),
            createCoinblocksPresets({ scale: "date" }),
          ],
        } satisfies PartialPresetFolder,
        {
          name: "By Height (Coming soon)",
          tree: [
            // createMarketPresets({ scale: "height", datasets }),
            // createMinersPresets("height"),
            // createTransactionsPresets("height"),
            // ...createCohortPresetList({
            //   datasets,
            //   scale: "height",
            //   color: colors.bitcoin,
            //   name: "",
            //   datasetKey: "",
            //   title: "",
            // }),
            // createHodlersPresets({ scale: "height", datasets }),
            // createAddressesPresets({ scale: "height", datasets }),
            // createCoinblocksPresets({ scale: "height", datasets }),
          ],
        } satisfies PartialPresetFolder,
      ],
    },
  ];

  const { list, ids, tree } = flatten(partialTree);

  checkIfDuplicateIds(ids);

  setIsFavorites(list);

  setVisited(list);

  const favorites = createMemo(() =>
    list.filter((preset) => preset.isFavorite()),
  );

  createEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_FAVORITES_KEY,
      JSON.stringify(favorites().map((p) => p.id)),
    );
  });

  const visited = createMemo(() => list.filter((preset) => preset.visited()));

  createEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_VISITED_KEY,
      JSON.stringify(visited().map((p) => p.id)),
    );
  });

  createEffect(() => {
    const serializedHistory: SerializedPresetsHistory = history().map(
      ({ preset, date }) => ({
        p: preset.id,
        d: date.valueOf(),
      }),
    );

    localStorage.setItem(
      LOCAL_STORAGE_HISTORY_KEY,
      JSON.stringify(serializedHistory),
    );
  });

  const history: PresetsHistorySignal = createRWS(getHistory(list), {
    equals: false,
  });

  const selected = createRWS(findInitialPreset(list), {
    equals: false,
  });

  createEffect((previousPreset: Preset) => {
    if (previousPreset && previousPreset !== selected()) {
      resetURLParams();
    }
    return selected();
  }, selected());

  createEffect(() => selected().visited.set(true));

  const select = (preset: Preset) => {
    if (selected().id === preset.id) {
      return;
    }

    history.set((l) => {
      l.unshift({
        date: new Date(),
        preset,
      });
      return l;
    });

    _select(preset, selected.set);
  };

  const openedFolders = createRWS(
    new Set(
      JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_FOLDERS_KEY) || "[]",
      ) as string[],
    ),
    {
      equals: false,
    },
  );

  createEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_FOLDERS_KEY,
      JSON.stringify(Array.from(openedFolders())),
    );
  });

  return {
    tree,
    list,
    selected,
    favorites,
    history,
    select,
    openedFolders,
  };
}

function _select(preset: Preset, set: Setter<Preset>) {
  const key = LOCAL_STORAGE_SELECTED_KEY;
  const value = preset.id;

  localStorage.setItem(key, value);

  replaceHistory({ pathname: `/${value}` });

  set(preset);
}

function flatten(partialTree: PartialPresetTree) {
  const result: { list: Preset[]; ids: string[] } = { list: [], ids: [] };

  const _flatten = (partialTree: PartialPresetTree, path?: FilePath) => {
    partialTree.forEach((anyPreset) => {
      if ("tree" in anyPreset) {
        const id = stringToId(
          `${(path || [])?.map(({ name }) => name).join(" ")} ${anyPreset.name} folder`,
        );

        const presetFolder: PresetFolder = {
          ...anyPreset,
          tree: anyPreset.tree as PresetTree,
          id,
        };

        Object.assign(anyPreset, presetFolder);

        result.ids.push(presetFolder.id);

        return _flatten(presetFolder.tree, [
          ...(path || []),
          {
            name: presetFolder.name,
            id: presetFolder.id,
          },
        ]);
      } else {
        const preset = {
          ...anyPreset,
          path: path || [],
          isFavorite: createRWS(false),
          visited: createRWS(false),
          id: `${anyPreset.scale}-to-${stringToId(anyPreset.title)}`,
        } satisfies Preset;

        result.list.push(Object.assign(anyPreset, preset));
        result.ids.push(preset.id);
      }
    });
  };

  _flatten(partialTree);

  return { ...result, tree: partialTree as PresetTree };
}

function checkIfDuplicateIds(ids: string[]) {
  if (ids.length !== new Set(ids).size) {
    const m = new Map<string, number>();

    ids.forEach((id) => {
      m.set(id, (m.get(id) || 0) + 1);
    });

    console.log(
      [...m.entries()].filter(([_, value]) => value > 1).map(([key, _]) => key),
    );

    throw Error("ID duplicate");
  }
}

function findInitialPreset(presets: Preset[]): Preset {
  const urlPreset = document.location.pathname.substring(1);

  return (
    (urlPreset &&
      (presets.find((preset) => preset.id === urlPreset) ||
        presets.find(
          (preset) =>
            preset.id === localStorage.getItem(LOCAL_STORAGE_SELECTED_KEY),
        ))) ||
    presets[0]
  );
}

function setIsFavorites(list: Preset[]) {
  (
    JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY) || "[]",
    ) as string[]
  ).forEach((id) => {
    list.find((preset) => preset.id === id)?.isFavorite.set(true);
  });
}

function setVisited(list: Preset[]) {
  (
    JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_VISITED_KEY) || "[]",
    ) as string[]
  ).forEach((id) => {
    list.find((preset) => preset.id === id)?.visited.set(true);
  });
}

function getHistory(list: Preset[]): PresetsHistory {
  return (
    JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY) || "[]",
    ) as SerializedPresetsHistory
  ).flatMap(({ p, d }) => {
    const preset = list.find((preset) => preset.id === p);

    return preset ? [{ preset, date: new Date(d) }] : [];
  });
}
