// @ts-check

// Lightweight Charts download link: https://unpkg.com/browse/lightweight-charts@4.2.0/dist/

/**
 * @import { FilePath, PartialPreset, PartialPresetFolder, PartialPresetTree, Preset, PresetFolder, PresetTree, ResourceDataset, Scale, SerializedPresetsHistory, TimeRange } from "./types/self"
 * @import * as _ from "./libraries/uFuzzy/uFuzzy.d.ts"
 * @import { DeepPartial, ChartOptions, IChartApi, IHorzScaleBehavior } from "./libraries/lightweight-charts/types.d.ts"
 */

/*
 * Reactivity
 * https://gist.github.com/1Marc/09e739caa6a82cc176ab4c2abd691814
 * Credit Ryan Carniato https://frontendmasters.com/courses/reactivity-solidjs/
 */

/**
 * @typedef Effect
 * @type {object}
 * @property {VoidFunction} execute
 * @property {Set<Set<Effect>>} dependencies
 */

/**
 * @template T
 * @typedef {{(): T}} Accessor
 */

/**
 * @template T
 * @typedef {{ (): T; set: (newValue: T | ((old: T) => T)) => void }} Signal
 */

/** @type {Effect[]} */
let context = [];

/** @param {VoidFunction} fn  */
function untrack(fn) {
  const prevContext = context;
  context = [];
  const res = fn();
  context = prevContext;
  return res;
}

/** @param {Effect} observer */
function cleanup(observer) {
  for (const dep of observer.dependencies) {
    dep.delete(observer);
  }
  observer.dependencies.clear();
}

/**
 * @param {Effect} observer
 * @param {Set<Effect>} subscriptions
 */
function subscribe(observer, subscriptions) {
  subscriptions.add(observer);
  observer.dependencies.add(subscriptions);
}

/**
 * @template T
 * @param {T} value
 * @param {{ equals?: boolean}} [options]
 */
function createSignal(value, options) {
  const subscriptions = new Set();

  function read() {
    const observer = context[context.length - 1];
    if (observer) subscribe(observer, subscriptions);
    return value;
  }

  /** @param {T | ((old: T) => T)} newValue */
  function write(newValue) {
    if (options?.equals !== false && value === newValue) {
      return;
    }

    if (typeof newValue === "function") {
      // @ts-ignore
      value = newValue(value);
    } else {
      value = newValue;
    }
    for (const observer of [...subscriptions]) {
      observer.execute();
    }
  }

  read.set = write;

  return read;
}

/** @param {VoidFunction} fn  */
function createEffect(fn) {
  /** @type {Effect} */
  const effect = {
    execute() {
      cleanup(effect);
      context.push(effect);
      fn();
      context.pop();
    },
    dependencies: new Set(),
  };

  effect.execute();

  return effect;
}

/**
 * @template T
 * @param {() => T} fn
 */
function createMemo(fn) {
  /** @type {Signal<T>} */
  const signal = /** @type {any} */ (createSignal(undefined));
  createEffect(() => signal.set(fn()));
  return signal;
}

function createScope() {
  /** @type {Effect[]} */
  const observers = [];

  return {
    /** @param {VoidFunction} callback  */
    observe(callback) {
      this.add(createEffect(callback));
    },
    /** @param {Effect} effect  */
    add(effect) {
      observers.push(effect);
    },
    reset() {
      for (let i = 0; i < observers.length; i++) {
        cleanup(observers[i]);
      }
      observers.length = 0;
    },
  };
}

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
function getElementById(id) {
  const element = window.document.getElementById(id);
  if (!element) throw `Element with id = "${id}" should exist`;
  return element;
}

/**
 * @param {string} s
 * @returns {string}
 */
function stringToId(s) {
  return s.replace(/\W/g, " ").trim().replace(/ +/g, "-").toLowerCase();
}

/** @param {VoidFunction} callback  */
function runWhenIdle(callback) {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
}

// TODO: Wrap all on dom object
const mainFrames = getElementById("frames");
const chartFrameSelectorLabelId = `selected-frame-selector-label`;
const chartLabel = getElementById(chartFrameSelectorLabelId);
const foldersLabel = getElementById(`folders-frame-selector-label`);
const searchLabel = getElementById(`search-frame-selector-label`);
const foldersFrame = getElementById("folders-frame");
const searchFrame = getElementById("search-frame");
const historyFrame = getElementById("history-frame");
const historyList = getElementById("history-list");
const searchInput = /** @type {HTMLInputElement} */ (
  getElementById("search-input")
);
const searchSmall = getElementById("search-small");
const searchResults = getElementById("search-results");
const presetTitle = getElementById("preset-title");
const presetDescription = getElementById("preset-description");
const foldersFilterAllCount = getElementById("folders-filter-all-count");
const foldersFilterFavoritesCount = getElementById(
  "folders-filter-favorites-count"
);
const foldersFilterNewCount = getElementById("folders-filter-new-count");

(function initFrames() {
  const localStorageKey = "checked-frame-selector-label";
  let selectedFrameLabel = localStorage.getItem(localStorageKey);

  const fieldset = window.document.getElementById("frame-selectors");
  if (!fieldset) throw "Fieldset should exist";

  const children = Array.from(fieldset.children);

  /** @type {HTMLElement | undefined} */
  let focusedSection = undefined;

  for (let i = 0; i < children.length; i++) {
    const element = children[i];

    switch (element.tagName) {
      case "LABEL": {
        element.addEventListener("click", (event) => {
          const id = element.id;

          event.stopPropagation();
          event.preventDefault();

          const forId = element.getAttribute("for") || "";
          const input = /** @type {HTMLInputElement | undefined} */ (
            window.document.getElementById(forId)
          );

          if (!input) throw "Shouldn't be possible";
          selectedFrameLabel = id;
          localStorage.setItem(localStorageKey, id);
          input.checked = true;

          const sectionId = element.id.split("-").splice(0, 2).join("-");

          const section = window.document.getElementById(sectionId);

          if (!section) {
            console.log(sectionId, section);
            throw "Section should exist";
          }

          if (section === focusedSection) {
            return;
          }

          section.hidden = false;
          if (focusedSection?.parentElement === mainFrames) {
            focusedSection.hidden = true;
          }
          focusedSection = section;
        });
        break;
      }
    }
  }

  if (selectedFrameLabel) {
    const frameLabel = window.document.getElementById(selectedFrameLabel);
    if (!frameLabel) throw "Frame should exist";
    frameLabel.click();
  } else {
    chartLabel.click();
  }

  // When going from mobile view to desktop view, if selected frame was open, go to the folders frame
  new IntersectionObserver((entries) => {
    for (let i = 0; i < entries.length; i++) {
      if (
        !entries[i].isIntersecting &&
        entries[i].target === chartLabel &&
        selectedFrameLabel === chartFrameSelectorLabelId
      ) {
        foldersLabel.click();
      }
    }
  }).observe(chartLabel);

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "Escape": {
        event.stopPropagation();
        event.preventDefault();
        foldersLabel.click();
        break;
      }
      case "/": {
        if (window.document.activeElement === searchInput) {
          return;
        }

        event.stopPropagation();
        event.preventDefault();
        searchLabel.click();
        searchInput.focus();
        break;
      }
    }
  });
})();

const dark = createSignal(true);

(function initEverythingRelatedToPresets() {
  /** @type {Signal<Preset>} */
  const selected = createSignal(/** @type {any} */ (undefined));
  const selectedLocalStorageKey = `selected-id`;
  const savedSelectedId = localStorage.getItem(selectedLocalStorageKey);
  const firstTime = !savedSelectedId;

  /**
   * @param {Scale} scale
   * @returns {PartialPresetFolder}
   */
  function createMarketPresets(scale) {
    return {
      name: "Market",
      tree: [
        {
          scale,
          icon: "💵",
          name: "Price",
          title: "Market Price",
          description: "",
          unit: "US Dollars",
        },
        {
          scale,
          icon: "♾️",
          name: "Capitalization",
          title: "Market Capitalization",
          description: "",
          unit: "US Dollars",
          bottom: [
            {
              title: "Market Cap.",
              datasetPath: `${scale}-to-market-cap`,
              color: "#f97315",
            },
          ],
        },
      ],
    };
  }

  /** @type {PartialPresetTree} */
  const partialTree = [
    {
      name: "Dashboards",
      tree: [],
    },
    {
      name: "Charts",
      tree: [
        {
          name: "By Block Date",
          tree: [createMarketPresets("date")],
        },
        {
          name: "By Block Height - Desktop/Tablet Only",
          tree: [createMarketPresets("height")],
        },
      ],
    },
  ];

  /** @type {string[]} */
  const presetsIds = [];

  /** @type {Preset[]} */
  const presetsList = [];

  /** @type {HTMLDetailsElement[]} */
  const detailsList = [];

  /** @typedef {'all' | 'favorites' | 'new'} FoldersFilter */

  const foldersFilterLocalStorageKey = "folders-filter";
  const filter = createSignal(
    /** @type {FoldersFilter} */ (
      localStorage.getItem(foldersFilterLocalStorageKey) || "all"
    )
  );

  const favoritesCount = createSignal(0);
  const newCount = createSignal(0);
  /** @param {Preset} preset  */
  function updateCounters(preset) {
    let firstFavoritesRun = true;
    createEffect(() => {
      if (preset.isFavorite()) {
        favoritesCount.set((c) => c + 1);
      } else if (!firstFavoritesRun) {
        favoritesCount.set((c) => c - 1);
      }
      firstFavoritesRun = false;
    });

    let firstNewRun = true;
    createEffect(() => {
      if (!preset.visited()) {
        newCount.set((c) => c + 1);
      } else if (!firstNewRun) {
        newCount.set((c) => c - 1);
      }
      firstNewRun = false;
    });
  }

  /** @param {string} id  */
  function createVisitedPresetLocalStorageKey(id) {
    return `${id}-visited`;
  }

  /** @param {{preset: Preset, frame: string, name?: string, top?: string, id?: string}} args  */
  function createPresetLabel({ preset, frame, name, top, id }) {
    const label = window.document.createElement("label");
    const input = window.document.createElement("input");
    input.type = "radio";
    id = id ? `-${id}` : "";
    input.name = `preset-${frame}${id}`;
    input.id = `${preset.id}-${frame}${id}-selector`;
    input.value = preset.id;
    label.append(input);
    label.id = `${input.id}-label`;
    // @ts-ignore
    label.for = input.id;
    label.title = preset.title;

    if (top) {
      const small = window.document.createElement("small");
      small.innerHTML = top;
      label.append(small);
    }

    const spanMain = window.document.createElement("span");
    spanMain.classList.add("main");
    label.append(spanMain);

    const spanEmoji = window.document.createElement("span");
    spanEmoji.classList.add("emoji");
    spanEmoji.innerHTML = preset.icon;
    spanMain.append(spanEmoji);

    const spanName = window.document.createElement("span");
    spanName.classList.add("name");
    spanName.innerHTML = name || preset.name;
    spanMain.append(spanName);

    /** @type {HTMLSpanElement | undefined} */
    let spanNew;

    if (!preset.visited()) {
      spanNew = window.document.createElement("span");
      spanNew.classList.add("new");
      spanMain.append(spanNew);
    }

    /** @type {HTMLSpanElement | undefined} */
    let spanFavorite;

    if (preset.isFavorite()) {
      spanFavorite = window.document.createElement("span");
      spanFavorite.classList.add("favorite");
      spanMain.append(spanFavorite);
    }

    if (!selected() && (firstTime || savedSelectedId === preset.id)) {
      selected.set(preset);
    }
    label.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      selected.set(preset);
    });

    const effect = createEffect(() => {
      if (selected()?.id === preset.id) {
        input.checked = true;
        spanNew?.remove();
        preset.visited.set(true);
        localStorage.setItem(
          createVisitedPresetLocalStorageKey(preset.id),
          "1"
        );
        localStorage.setItem(selectedLocalStorageKey, preset.id);
      } else {
        input.checked = false;
      }
    });

    return { label, effect };
  }

  /**
   * @param {PartialPresetTree} partialTree
   * @param {HTMLElement} parent
   * @param {FilePath | undefined} path
   * @returns {Signal<number>}
   */
  function processPartialTree(partialTree, parent, path = undefined) {
    const ul = window.document.createElement("ul");
    parent.appendChild(ul);

    /** @type {Accessor<number>[]} */
    const listForSum = [];

    partialTree.forEach((anyPartial) => {
      const li = window.document.createElement("li");
      ul.appendChild(li);

      if ("tree" in anyPartial) {
        const folderId = stringToId(
          `${(path || [])?.map(({ name }) => name).join(" ")} ${
            anyPartial.name
          } folder`
        );

        /** @type {Omit<PresetFolder, keyof PartialPresetFolder>} */
        const restFolder = {
          id: folderId,
        };

        Object.assign(anyPartial, restFolder);

        presetsIds.push(restFolder.id);

        const details = window.document.createElement("details");
        const folderOpenLocalStorageKey = `${folderId}-open`;
        details.open = !!localStorage.getItem(folderOpenLocalStorageKey);
        detailsList.push(details);
        li.appendChild(details);

        const summary = window.document.createElement("summary");
        summary.id = folderId;

        const spanMarker = window.document.createElement("span");
        spanMarker.classList.add("marker");
        spanMarker.innerHTML = "●";
        summary.append(spanMarker);

        const spanName = window.document.createElement("span");
        spanName.classList.add("name");
        spanName.innerHTML = anyPartial.name;
        summary.append(spanName);

        const smallCount = window.document.createElement("small");
        smallCount.hidden = details.open;
        summary.append(smallCount);

        details.appendChild(summary);

        details.addEventListener("toggle", () => {
          const open = details.open;

          smallCount.hidden = open;

          if (open) {
            spanMarker.innerHTML = "○";
            localStorage.setItem(folderOpenLocalStorageKey, "1");
          } else {
            spanMarker.innerHTML = "●";
            localStorage.removeItem(folderOpenLocalStorageKey);
          }
        });

        const childPresetsCount = processPartialTree(anyPartial.tree, details, [
          ...(path || []),
          {
            name: anyPartial.name,
            id: restFolder.id,
          },
        ]);

        listForSum.push(childPresetsCount);

        createEffect(() => {
          const count = childPresetsCount();
          smallCount.innerHTML = count.toString();

          if (!count) {
            li.hidden = true;
          } else {
            li.hidden = false;
          }
        });
      } else {
        const id = `${anyPartial.scale}-to-${stringToId(anyPartial.title)}`;

        const favoriteLocalStorageKey = `${id}-favorite`;

        /** @type {Omit<Preset, keyof PartialPreset>} */
        const restPreset = {
          id,
          path: path || [],
          serializedPath: `/ ${[
            ...(path || []).map(({ name }) => name),
            anyPartial.name,
          ].join(" / ")}`,
          isFavorite: createSignal(false),
          visited: createSignal(
            !!localStorage.getItem(createVisitedPresetLocalStorageKey(id))
          ),
        };

        Object.assign(anyPartial, restPreset);

        const preset = /** @type {Preset} */ (anyPartial);

        updateCounters(preset);

        const { label } = createPresetLabel({
          preset,
          frame: "folders",
        });
        const inDom = createSignal(true);
        li.append(label);

        // DOM effect
        createEffect(() => {
          switch (filter()) {
            case "all": {
              if (!inDom()) {
                ul.append(li);
                inDom.set(true);
              }
              break;
            }
            case "favorites": {
              if (preset.isFavorite()) {
                if (!inDom()) {
                  ul.append(li);
                  inDom.set(true);
                }
              } else if (inDom()) {
                inDom.set(false);
                ul.removeChild(li);
              }
              break;
            }
            case "new": {
              if (!preset.visited()) {
                if (!inDom()) {
                  ul.append(li);
                  inDom.set(true);
                }
              } else if (inDom()) {
                inDom.set(false);
                ul.removeChild(li);
              }
              break;
            }
          }
        });

        const memo = createMemo(() => (inDom() ? 1 : 0));
        listForSum.push(memo);

        presetsList.push(preset);
        presetsIds.push(id);
      }
    });

    return createMemo(() => listForSum.reduce((acc, s) => acc + s(), 0));
  }

  const tree = window.document.createElement("div");
  tree.classList.add("tree");
  foldersFrame.append(tree);
  const allCount = processPartialTree(partialTree, tree);

  (function checkUniqueIds() {
    if (presetsIds.length !== new Set(presetsIds).size) {
      /** @type {Map<string, number>} */
      const m = new Map();

      presetsIds.forEach((id) => {
        m.set(id, (m.get(id) || 0) + 1);
      });

      console.log(
        [...m.entries()]
          .filter(([_, value]) => value > 1)
          .map(([key, _]) => key)
      );

      throw Error("ID duplicate");
    }
  })();

  (function createCountersDomUpdateEffect() {
    foldersFilterAllCount.innerHTML = allCount().toLocaleString();
    createEffect(() => {
      foldersFilterFavoritesCount.innerHTML = favoritesCount().toLocaleString();
    });
    createEffect(() => {
      foldersFilterNewCount.innerHTML = newCount().toLocaleString();
    });
  })();

  (function initFilterElements() {
    const filterAllInput = /** @type {HTMLInputElement} */ (
      getElementById("folders-filter-all")
    );
    const filterFavoritesInput = /** @type {HTMLInputElement} */ (
      getElementById("folders-filter-favorites")
    );
    const filterNewInput = /** @type {HTMLInputElement} */ (
      getElementById("folders-filter-new")
    );

    filterAllInput.addEventListener("change", () => {
      filter.set("all");
    });
    filterFavoritesInput.addEventListener("change", () => {
      filter.set("favorites");
    });
    filterNewInput.addEventListener("change", () => {
      filter.set("new");
    });

    createEffect(() => {
      const f = filter();
      localStorage.setItem(foldersFilterLocalStorageKey, f);
      switch (f) {
        case "all": {
          filterAllInput.checked = true;
          break;
        }
        case "favorites": {
          filterFavoritesInput.checked = true;
          break;
        }
        case "new": {
          filterNewInput.checked = true;
          break;
        }
      }
    });
  })();

  (function initCloseAllButton() {
    getElementById("button-close-all-folders").addEventListener("click", () => {
      detailsList.forEach((details) => (details.open = false));
    });
  })();

  (function initGoToSelectedButton() {
    function goToSelected() {
      filter.set("all");

      if (!selected()) throw "Selected should be set by now";
      const selectedId = selected().id;

      selected().path.forEach(({ id }) => {
        const summary = getElementById(id);
        const details = /** @type {HTMLDetailsElement | undefined} */ (
          summary.parentElement
        );
        if (!details) throw "Parent details should exist";
        if (!details.open) {
          summary.click();
        }
      });

      setTimeout(() => {
        getElementById(`${selectedId}-folders-selector`).scrollIntoView({
          behavior: "instant",
          block: "center",
        });
      }, 0);
    }

    getElementById("button-go-to-selected").addEventListener(
      "click",
      goToSelected
    );

    if (firstTime) {
      goToSelected();
    }
  })();

  createEffect(() => {
    const preset = selected();
    presetTitle.innerHTML = preset.title;
    presetDescription.innerHTML = preset.serializedPath;
  });

  const LOCAL_STORAGE_RANGE_KEY = "chart-range";
  const URL_PARAMS_RANGE_FROM_KEY = "from";
  const URL_PARAMS_RANGE_TO_KEY = "to";
  const HEIGHT_CHUNK_SIZE = 10_000;

  /**
   * @param {Scale} scale
   * @returns {string}
   */
  function getVisibleRangeLocalStorageKey(scale) {
    return `${LOCAL_STORAGE_RANGE_KEY}-${scale}`;
  }

  /**
   * @param {Scale} scale
   * @returns {TimeRange}
   */
  function getInitialVisibleRange(scale) {
    const urlParams = new URLSearchParams(window.location.search);

    const urlFrom = urlParams.get(URL_PARAMS_RANGE_FROM_KEY);
    const urlTo = urlParams.get(URL_PARAMS_RANGE_TO_KEY);

    if (urlFrom && urlTo) {
      if (scale === "date" && urlFrom.includes("-") && urlTo.includes("-")) {
        return {
          from: new Date(urlFrom).toJSON().split("T")[0],
          to: new Date(urlTo).toJSON().split("T")[0],
        };
      } else if (
        scale === "height" &&
        !urlFrom.includes("-") &&
        !urlTo.includes("-")
      ) {
        return {
          from: Number(urlFrom),
          to: Number(urlTo),
        };
      }
    }

    /** @type {TimeRange | null} */
    const savedTimeRange = /** @type {any} */ (
      JSON.parse(
        localStorage.getItem(getVisibleRangeLocalStorageKey(scale)) || "null"
      )
    );

    if (savedTimeRange) {
      return savedTimeRange;
    }

    switch (scale) {
      case "date": {
        const defaultTo = new Date();
        const defaultFrom = new Date();
        defaultFrom.setDate(defaultFrom.getUTCDate() - 6 * 30);

        return {
          from: defaultFrom.toJSON().split("T")[0],
          to: defaultTo.toJSON().split("T")[0],
        };
      }
      case "height": {
        return {
          from: 800_000,
          to: 850_000,
        };
      }
    }
  }

  runWhenIdle(() =>
    import("./libraries/lightweight-charts/standalone.mjs").then(
      ({ createChart: createClassicChart }) => {
        const scale = createMemo(() => selected().scale);
        const activeDatasets = createSignal(
          /** @type {ResourceDataset<any, any>[]} */ ([]),
          {
            equals: false,
          }
        );
        const visibleRange = createSignal(getInitialVisibleRange(scale()));
        const visibleDatasetIds = createSignal(/** @type {number[]} */ ([]), {
          equals: false,
        });

        function setActiveIds() {
          /** @type {number[]} */
          let ids = [];

          const today = new Date();
          const { from: rawFrom, to: rawTo } = visibleRange();

          if (typeof rawFrom === "string" && typeof rawTo === "string") {
            const from = new Date(rawFrom).getUTCFullYear();
            const to = new Date(rawTo).getUTCFullYear();

            ids = Array.from(
              { length: to - from + 1 },
              (_, i) => i + from
            ).filter((year) => year >= 2009 && year <= today.getUTCFullYear());
          } else {
            const from = Math.floor(Number(rawFrom) / HEIGHT_CHUNK_SIZE);
            const to = Math.floor(Number(rawTo) / HEIGHT_CHUNK_SIZE);

            const length = to - from + 1;

            ids = Array.from(
              { length },
              (_, i) => (from + i) * HEIGHT_CHUNK_SIZE
            );
          }

          const old = visibleDatasetIds();

          if (
            old.length !== ids.length ||
            old.at(0) !== ids.at(0) ||
            old.at(-1) !== ids.at(-1)
          ) {
            console.log("range:", ids);

            visibleDatasetIds.set(ids);
          }
        }
        setActiveIds();

        (function createFetchChunksOfVisibleDatasetsEffect() {
          // Fetch visible dataset
          createEffect(() => {
            const ids = visibleDatasetIds();
            const datasets = activeDatasets();
            for (let i = 0; i < ids.length; i++) {
              const id = ids[i];
              for (let j = 0; j < datasets.length; j++) {
                datasets[j].fetch(id);
              }
            }
          });
        })();

        /** @param {number} value  */
        function numberToShortUSLocale(value) {
          const absoluteValue = Math.abs(value);

          // value = absoluteValue;

          if (isNaN(value)) {
            return "";
            // } else if (value === 0) {
            //   return "0";
          } else if (absoluteValue < 10) {
            return numberToUSLocale(value, 3);
          } else if (absoluteValue < 100) {
            return numberToUSLocale(value, 2);
          } else if (absoluteValue < 1_000) {
            return numberToUSLocale(value, 1);
          } else if (absoluteValue < 100_000) {
            return numberToUSLocale(value, 0);
          } else if (absoluteValue < 1_000_000) {
            return `${numberToUSLocale(value / 1_000, 1)}K`;
          } else if (absoluteValue >= 1_000_000_000_000_000_000) {
            return "Inf.";
          }

          const log = Math.floor(Math.log10(absoluteValue) - 6);

          const suffices = ["M", "B", "T", "Q"];
          const letterIndex = Math.floor(log / 3);
          const letter = suffices[letterIndex];

          const modulused = log % 3;

          if (modulused === 0) {
            return `${numberToUSLocale(
              value / (1_000_000 * 1_000 ** letterIndex),
              3
            )}${letter}`;
          } else if (modulused === 1) {
            return `${numberToUSLocale(
              value / (1_000_000 * 1_000 ** letterIndex),
              2
            )}${letter}`;
          } else {
            return `${numberToUSLocale(
              value / (1_000_000 * 1_000 ** letterIndex),
              1
            )}${letter}`;
          }
        }

        /**
         * @param {number} value
         * @param {number} [digits]
         * @param {Intl.NumberFormatOptions} [options]
         */
        function numberToUSLocale(value, digits, options) {
          return value.toLocaleString("en-us", {
            ...options,
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
          });
        }

        /**
         * @class
         * @implements {IHorzScaleBehavior<number>}
         */
        class HorzScaleBehaviorHeight {
          options() {
            return /** @type {any} */ (undefined);
          }
          setOptions() {}
          preprocessData() {}
          updateFormatter() {}

          createConverterToInternalObj() {
            /** @type {(p: any) => any} */
            return (price) => price;
          }

          /** @param {any} item  */
          key(item) {
            return item;
          }

          /** @param {any} item  */
          cacheKey(item) {
            return item;
          }

          /** @param {any} item  */
          convertHorzItemToInternal(item) {
            return item;
          }

          /** @param {any} item  */
          formatHorzItem(item) {
            return item;
          }

          /** @param {any} tickMark  */
          formatTickmark(tickMark) {
            return tickMark.time.toLocaleString("en-us");
          }

          /** @param {any} tickMarks  */
          maxTickMarkWeight(tickMarks) {
            return tickMarks.reduce(this.getMarkWithGreaterWeight, tickMarks[0])
              .weight;
          }

          /**
           * @param {any} sortedTimePoints
           * @param {number} startIndex
           */
          fillWeightsForPoints(sortedTimePoints, startIndex) {
            for (
              let index = startIndex;
              index < sortedTimePoints.length;
              ++index
            ) {
              sortedTimePoints[index].timeWeight = this.computeHeightWeight(
                sortedTimePoints[index].time
              );
            }
          }

          /**
           * @param {any} a
           * @param {any} b
           */
          getMarkWithGreaterWeight(a, b) {
            return a.weight > b.weight ? a : b;
          }

          /** @param {number} value  */
          computeHeightWeight(value) {
            // if (value === Math.ceil(value / 1000000) * 1000000) {
            //   return 12;
            // }
            if (value === Math.ceil(value / 100000) * 100000) {
              return 11;
            }
            if (value === Math.ceil(value / 10000) * 10000) {
              return 10;
            }
            if (value === Math.ceil(value / 1000) * 1000) {
              return 9;
            }
            if (value === Math.ceil(value / 100) * 100) {
              return 8;
            }
            if (value === Math.ceil(value / 50) * 50) {
              return 7;
            }
            if (value === Math.ceil(value / 25) * 25) {
              return 6;
            }
            if (value === Math.ceil(value / 10) * 10) {
              return 5;
            }
            if (value === Math.ceil(value / 5) * 5) {
              return 4;
            }
            if (value === Math.ceil(value)) {
              return 3;
            }
            if (value * 2 === Math.ceil(value * 2)) {
              return 1;
            }

            return 0;
          }
        }

        const colors = (function createColors() {
          /** @param {Accessor<boolean>} dark  */
          function lightRed(dark) {
            const tailwindRed300 = "#fca5a5";
            const tailwindRed800 = "#991b1b";
            return dark() ? tailwindRed300 : tailwindRed800;
          }
          /** @param {Accessor<boolean>} dark  */
          function red(dark) {
            return "#e63636"; // 550
          }
          /** @param {Accessor<boolean>} dark  */
          function darkRed(dark) {
            const tailwindRed900 = "#7f1d1d";
            const tailwindRed100 = "#fee2e2";
            return dark() ? tailwindRed900 : tailwindRed100;
          }
          /** @param {Accessor<boolean>} dark  */
          function orange(dark) {
            return "#fa5c00"; // 550
          }
          /** @param {Accessor<boolean>} dark  */
          function darkOrange(dark) {
            const tailwindOrange900 = "#7c2d12";
            const tailwindOrange100 = "#ffedd5";
            return dark() ? tailwindOrange900 : tailwindOrange100;
          }
          /** @param {Accessor<boolean>} dark  */
          function amber(dark) {
            return "#df9408"; // 550
          }
          /** @param {Accessor<boolean>} dark  */
          function yellow(dark) {
            return "#db9e03"; // 550
          }
          /** @param {Accessor<boolean>} dark  */
          function lime(dark) {
            return "#74b713"; // 550
          }
          /** @param {Accessor<boolean>} dark  */
          function green(dark) {
            return "#1cb454";
          }
          /** @param {Accessor<boolean>} dark  */
          function darkGreen(dark) {
            const tailwindGreen900 = "#14532d";
            const tailwindGreen100 = "#dcfce7";
            return dark() ? tailwindGreen900 : tailwindGreen100;
          }
          /** @param {Accessor<boolean>} dark  */
          function emerald(dark) {
            return "#0ba775";
          }
          /** @param {Accessor<boolean>} dark  */
          function darkEmerald(dark) {
            const tailwindEmerald900 = "#064e3b";
            const tailwindEmerald100 = "#d1fae5";
            return dark() ? tailwindEmerald900 : tailwindEmerald100;
          }
          /** @param {Accessor<boolean>} dark  */
          function teal(dark) {
            return "#10a697"; // 550
          }
          /** @param {Accessor<boolean>} dark  */
          function cyan(dark) {
            return "#06a3c3"; // 550
          }
          /** @param {Accessor<boolean>} dark  */
          function sky(dark) {
            return "#0794d8"; // 550
          }
          /** @param {Accessor<boolean>} dark  */
          function blue(dark) {
            return "#2f73f1"; // 550
          }
          /** @param {Accessor<boolean>} dark  */
          function indigo(dark) {
            return "#5957eb";
          }
          /** @param {Accessor<boolean>} dark  */
          function violet(dark) {
            return "#834cf2";
          }
          /** @param {Accessor<boolean>} dark  */
          function purple(dark) {
            return "#9d45f0";
          }
          /** @param {Accessor<boolean>} dark  */
          function fuchsia(dark) {
            return "#cc37e1";
          }
          /** @param {Accessor<boolean>} dark  */
          function pink(dark) {
            return "#e53882";
          }
          /** @param {Accessor<boolean>} dark  */
          function rose(dark) {
            return "#ea3053";
          }
          /** @param {Accessor<boolean>} dark  */
          function darkRose(dark) {
            const tailwindRose900 = "#881337";
            const tailwindRose100 = "#ffe4e6";
            return dark() ? tailwindRose900 : tailwindRose100;
          }

          /** @param {Accessor<boolean>} dark  */
          function darkWhite(dark) {
            const tailwindGray400 = "#a3a3a3";
            const tailwindGray600 = "#525252";
            return dark() ? tailwindGray400 : tailwindGray600;
          }
          /** @param {Accessor<boolean>} dark  */
          function gray(dark) {
            const tailwindGray400 = "#a3a3a3";
            const tailwindGray600 = "#525252";
            return dark() ? tailwindGray600 : tailwindGray400;
          }

          /** @param {Accessor<boolean>} dark  */
          function white(dark) {
            return dark() ? "#ffffff" : "#000000";
          }

          /** @param {Accessor<boolean>} dark  */
          function black(dark) {
            return dark() ? "#000000" : "#ffffff";
          }

          return {
            white,
            black,
            darkWhite,
            gray,
            lightBitcoin: yellow,
            bitcoin: orange,
            darkBitcoin: darkOrange,
            lightDollars: lime,
            dollars: emerald,
            darkDollars: darkEmerald,

            _1d: lightRed,
            _1w: red,
            _8d: orange,
            _13d: amber,
            _21d: yellow,
            _1m: lime,
            _34d: green,
            _55d: emerald,
            _89d: teal,
            _144d: cyan,
            _6m: sky,
            _1y: blue,
            _2y: indigo,
            _200w: violet,
            _4y: purple,
            _10y: fuchsia,

            p2pk: lime,
            p2pkh: violet,
            p2sh: emerald,
            p2wpkh: cyan,
            p2wsh: pink,
            p2tr: blue,
            crab: red,
            fish: lime,
            humpback: violet,
            plankton: emerald,
            shark: cyan,
            shrimp: pink,
            whale: blue,
            megalodon: purple,
            realizedPrice: orange,
            oneMonthHolders: cyan,
            threeMonthsHolders: lime,
            sth: yellow,
            sixMonthsHolder: red,
            oneYearHolders: pink,
            twoYearsHolders: purple,
            lth: fuchsia,
            balancedPrice: yellow,
            cointimePrice: yellow,
            trueMarketMeanPrice: blue,
            vaultedPrice: green,
            cvdd: lime,
            terminalPrice: red,
            loss: red,
            darkLoss: darkRed,
            profit: green,
            darkProfit: darkGreen,
            thermoCap: green,
            investorCap: rose,
            realizedCap: orange,
            ethereum: indigo,
            usdt: emerald,
            usdc: blue,
            ust: red,
            busd: yellow,
            usdd: emerald,
            frax: gray,
            dai: amber,
            tusd: indigo,
            pyusd: blue,
            darkLiveliness: darkRose,
            liveliness: rose,
            vaultedness: green,
            activityToVaultednessRatio: violet,
            up_to_1d: lightRed,
            up_to_1w: red,
            up_to_1m: orange,
            up_to_2m: orange,
            up_to_3m: orange,
            up_to_4m: orange,
            up_to_5m: orange,
            up_to_6m: orange,
            up_to_1y: orange,
            up_to_2y: orange,
            up_to_3y: orange,
            up_to_4y: orange,
            up_to_5y: orange,
            up_to_7y: orange,
            up_to_10y: orange,
            up_to_15y: orange,
            from_10y_to_15y: purple,
            from_7y_to_10y: violet,
            from_5y_to_7y: indigo,
            from_3y_to_5y: sky,
            from_2y_to_3y: teal,
            from_1y_to_2y: green,
            from_6m_to_1y: lime,
            from_3m_to_6m: yellow,
            from_1m_to_3m: amber,
            from_1w_to_1m: orange,
            from_1d_to_1w: red,
            from_1y: green,
            from_2y: teal,
            from_4y: indigo,
            from_10y: violet,
            from_15y: fuchsia,
            coinblocksCreated: purple,
            coinblocksDestroyed: red,
            coinblocksStored: green,
            momentum: [green, yellow, red],
            momentumGreen: green,
            momentumYellow: yellow,
            momentumRed: red,
            probability0_1p: red,
            probability0_5p: orange,
            probability1p: yellow,
            year_2009: yellow,
            year_2010: yellow,
            year_2011: yellow,
            year_2012: yellow,
            year_2013: yellow,
            year_2014: yellow,
            year_2015: yellow,
            year_2016: yellow,
            year_2017: yellow,
            year_2018: yellow,
            year_2019: yellow,
            year_2020: yellow,
            year_2021: yellow,
            year_2022: yellow,
            year_2023: yellow,
            year_2024: yellow,
          };
        })();

        /** @arg {{scale: Scale, element: HTMLElement}} args */
        function createChart({ scale, element }) {
          /** @satisfies {DeepPartial<ChartOptions>} */
          const options = {
            autoSize: true,
            layout: {
              fontFamily: "Satoshi Chart",
              background: { color: "transparent" },
              attributionLogo: false,
            },
            grid: {
              vertLines: { visible: false },
              horzLines: { visible: false },
            },
            timeScale: {
              minBarSpacing: 0.05,
              shiftVisibleRangeOnNewBar: false,
              allowShiftVisibleRangeOnWhitespaceReplacement: false,
            },
            handleScale: {
              axisDoubleClickReset: {
                time: false,
              },
            },
            crosshair: {
              mode: 0,
            },
            localization: {
              priceFormatter: numberToShortUSLocale,
              locale: "en-us",
            },
          };

          /** @type {IChartApi} */
          let chart;

          if (scale === "date") {
            chart = createClassicChart(element, options);
          } else {
            const horzScaleBehavior = new HorzScaleBehaviorHeight();
            // @ts-ignore
            chart = createCustomChart(element, horzScaleBehavior, options);
          }

          chart.priceScale("right").applyOptions({
            scaleMargins: {
              top: 0.075,
              bottom: 0.05,
            },
            minimumWidth: 78,
          });

          createEffect(() => {
            const { white } = colors;

            const color = white(dark);

            chart.applyOptions({
              layout: {
                textColor: "#666666",
              },
              rightPriceScale: {
                borderVisible: false,
              },
              timeScale: {
                borderVisible: false,
              },
              crosshair: {
                horzLine: {
                  color: color,
                  labelBackgroundColor: color,
                },
                vertLine: {
                  color: color,
                  labelBackgroundColor: color,
                },
              },
            });
          });

          return chart;
        }

        createEffect(() => {
          const preset = selected();
          const configs = [preset.top || [], preset.bottom].flatMap((list) =>
            list ? [list] : []
          );
          const scale = preset.scale;

          configs.forEach((config, index) => {
            const chart = createChart({
              scale,
              element: div,
            });
          });
        });
      }
    )
  );

  (function initSearchFrame() {
    getElementById("reset-search").addEventListener("click", () => {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
      searchInput.focus();
    });

    searchInput.addEventListener(
      "focus",
      () => {
        const haystack = presetsList.map(
          (preset) => `${preset.title}\t${preset.serializedPath}`
        );

        const searchSmallOgInnerHTML = searchSmall.innerHTML;

        const RESULTS_PER_PAGE = 100;

        const scope = createScope();

        import("./libraries/uFuzzy/uFuzzy.esm.js").then(
          ({ default: ufuzzy }) => {
            /**
             * @param {uFuzzy.SearchResult} searchResult
             * @param {number} pageIndex
             */
            function computeResultPage(searchResult, pageIndex) {
              /** @type {{ preset: Preset, path: string, title: string }[]} */
              let list = [];

              let [indexes, info, order] = searchResult || [null, null, null];

              const minIndex = pageIndex * RESULTS_PER_PAGE;

              if (indexes?.length) {
                const maxIndex = Math.min(
                  (order || indexes).length - 1,
                  minIndex + RESULTS_PER_PAGE - 1
                );

                list = Array(maxIndex - minIndex + 1);

                if (info && order) {
                  for (let i = minIndex; i <= maxIndex; i++) {
                    let infoIdx = order[i];

                    const [title, path] = ufuzzy
                      .highlight(
                        haystack[info.idx[infoIdx]],
                        info.ranges[infoIdx]
                      )
                      .split("\t");

                    list[i % 100] = {
                      preset: presetsList[info.idx[infoIdx]],
                      path,
                      title,
                    };
                  }
                } else {
                  for (let i = minIndex; i <= maxIndex; i++) {
                    let index = indexes[i];

                    const [title, path] = haystack[index].split("\t");

                    list[i % 100] = {
                      preset: presetsList[index],
                      path,
                      title,
                    };
                  }
                }
              }

              return list;
            }

            /** @type {uFuzzy.Options} */
            const config = {
              intraIns: Infinity,
              intraChars: `[a-z\d' ]`,
            };

            const fuzzyMultiInsert = /** @type {uFuzzy} */ (
              ufuzzy({
                intraIns: 1,
              })
            );
            const fuzzyMultiInsertFuzzier = /** @type {uFuzzy} */ (
              ufuzzy(config)
            );
            const fuzzySingleError = /** @type {uFuzzy} */ (
              ufuzzy({
                intraMode: 1,
                ...config,
              })
            );
            /** @type {import("./libraries/uFuzzy/uFuzzy.d.ts")} */
            const fuzzySingleErrorFuzzier = /** @type {uFuzzy} */ (
              ufuzzy({
                intraMode: 1,
                ...config,
              })
            );

            searchInput.addEventListener("input", () => {
              scope.reset();

              searchResults.scrollTo({
                top: 0,
              });

              const needle = /** @type {string} */ (searchInput.value);

              if (!needle) {
                searchSmall.innerHTML = searchSmallOgInnerHTML;
                searchResults.innerHTML = "";
                return;
              }

              const outOfOrder = 5;
              const infoThresh = 5_000;

              let result = fuzzyMultiInsert?.search(
                haystack,
                needle,
                undefined,
                infoThresh
              );

              if (!result?.[0]?.length || !result?.[1]) {
                result = fuzzyMultiInsert?.search(
                  haystack,
                  needle,
                  outOfOrder,
                  infoThresh
                );
              }

              if (!result?.[0]?.length || !result?.[1]) {
                result = fuzzySingleError?.search(
                  haystack,
                  needle,
                  outOfOrder,
                  infoThresh
                );
              }

              if (!result?.[0]?.length || !result?.[1]) {
                result = fuzzySingleErrorFuzzier?.search(
                  haystack,
                  needle,
                  outOfOrder,
                  infoThresh
                );
              }

              if (!result?.[0]?.length || !result?.[1]) {
                result = fuzzyMultiInsertFuzzier?.search(
                  haystack,
                  needle,
                  undefined,
                  infoThresh
                );
              }

              if (!result?.[0]?.length || !result?.[1]) {
                result = fuzzyMultiInsertFuzzier?.search(
                  haystack,
                  needle,
                  outOfOrder,
                  infoThresh
                );
              }

              searchSmall.innerHTML = `Found <strong>${
                result?.[0]?.length || 0
              }</strong> preset(s)`;
              searchResults.innerHTML = "";

              const list = computeResultPage(result, 0);

              list.forEach(({ preset, path, title }) => {
                const li = window.document.createElement("li");
                searchResults.appendChild(li);

                const { label, effect } = createPresetLabel({
                  preset,
                  frame: "search",
                  name: title,
                  top: path,
                });

                scope.add(effect);

                li.append(label);
              });
            });
          }
        );
      },
      {
        once: true,
      }
    );
  })();

  (function initHistory() {
    const LOCAL_STORAGE_HISTORY_KEY = "history";
    const MAX_HISTORY_LENGTH = 1_000;

    const history = /** @type {SerializedPresetsHistory} */ (
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY) || "[]")
    ).flatMap(([presetId, timestamp]) => {
      const preset = presetsList.find((preset) => preset.id === presetId);
      return preset ? [{ preset, date: new Date(timestamp) }] : [];
    });

    /** @param {Date} date  */
    function dateToTestedString(date) {
      return date.toLocaleString().split(",")[0];
    }

    /** @param {Date} date  */
    function dateToDisplayedString(date) {
      const formattedDate = dateToTestedString(date);

      const now = new Date();
      if (dateToTestedString(now) === formattedDate) {
        return "Today";
      }

      now.setUTCDate(now.getUTCDate() - 1);

      if (dateToTestedString(now) === formattedDate) {
        return "Yesterday";
      }

      return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    const grouped = history.reduce((grouped, { preset, date }) => {
      grouped[dateToTestedString(date)] ||= [];
      grouped[dateToTestedString(date)].push({ preset, date });
      return grouped;
    }, /** @type {Record<string, {preset: Preset, date: Date}[]>} */ ({}));

    /** @type {[string|undefined, string|undefined]} */
    const firstTwo = [undefined, undefined];

    (function initHistoryListInDom() {
      Object.entries(grouped).forEach(([key, tuples], index) => {
        if (index < 2) {
          firstTwo[index] = key;
        }

        const heading = window.document.createElement("h4");
        heading.id = key;
        heading.innerHTML = dateToDisplayedString(tuples[0].date);
        historyList.append(heading);

        tuples.forEach(({ preset, date }) => {
          historyList.append(
            createPresetLabel({
              preset,
              frame: "history",
              name: preset.title,
              id: date.valueOf().toString(),
              top: date.toLocaleTimeString(),
            }).label
          );
        });
      });
    })();

    createEffect(() => {
      const preset = selected();
      const date = new Date();
      const testedString = dateToTestedString(date);

      const { label } = createPresetLabel({
        preset,
        frame: "history",
        name: preset.title,
        id: date.valueOf().toString(),
        top: date.toLocaleTimeString(),
      });
      const li = window.document.createElement("li");
      li.append(label);

      if (testedString === firstTwo[0]) {
        if (selected() === grouped[testedString].at(0)?.preset) {
          return;
        }

        grouped[testedString].unshift({ preset, date });
        getElementById(testedString).after(li);
      } else {
        const [first, second] = firstTwo;
        /** @param {string | undefined} id  */
        function updateHeading(id) {
          if (!id) return;
          getElementById(id).innerHTML = dateToDisplayedString(
            grouped[id][0].date
          );
        }

        updateHeading(first);
        updateHeading(second);

        const heading = window.document.createElement("h4");
        heading.innerHTML = dateToDisplayedString(date);
        heading.id = testedString;

        historyList.prepend(li);
        historyList.prepend(heading);

        grouped[testedString] = [{ preset, date }];

        firstTwo[1] = firstTwo[0];
        firstTwo[0] = testedString;
      }

      history.unshift({
        date: new Date(),
        preset,
      });

      runWhenIdle(() => {
        /** @type {SerializedPresetsHistory} */
        const serializedHistory = history.map(({ preset, date }) => [
          preset.id,
          date.getTime(),
        ]);

        if (serializedHistory.length > MAX_HISTORY_LENGTH) {
          serializedHistory.length = MAX_HISTORY_LENGTH;
        }

        localStorage.setItem(
          LOCAL_STORAGE_HISTORY_KEY,
          JSON.stringify(serializedHistory)
        );
      });
    });
  })();
})();
