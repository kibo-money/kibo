import uFuzzy from "@leeoniya/ufuzzy";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";

import { scrollIntoView } from "/src/scripts/utils/scroll";
import { createRWS } from "/src/solid/rws";

import { INPUT_PRESET_SEARCH_ID } from "../..";
import { Box } from "./box";
import { Button } from "./button";
import { Line } from "./line";

const PER_PAGE = 100;

export function SearchFrame({
  presets,
  selectedFrame,
}: {
  presets: Presets;
  selectedFrame: Accessor<FrameName>;
}) {
  const counterRef = createRWS<HTMLDivElement | undefined>(undefined);

  const search = createRWS("", {
    equals: false,
  });

  const inputRef = createRWS<HTMLInputElement | undefined>(undefined);

  const config: uFuzzy.Options = {
    intraIns: Infinity,
    intraChars: `[a-z\d' ]`,
  };

  const fuzzyMultiInsert = new uFuzzy({
    intraIns: 1,
  });
  const fuzzyMultiInsertFuzzier = new uFuzzy(config);
  const fuzzySingleError = new uFuzzy({
    intraMode: 1,
    ...config,
  });
  const fuzzySingleErrorFuzzier = new uFuzzy({
    intraMode: 1,
    ...config,
  });

  const haystack = presets.list.map(
    (preset) =>
      `${preset.title}\t/ ${[...preset.path.map(({ name }) => name), preset.name].join(" / ")}`,
  );

  const searchResult = createMemo(() => {
    scrollIntoView(counterRef());

    const needle = search();

    if (!needle) return null;

    const outOfOrder = 5;
    const infoThresh = 5_000;

    let result = fuzzyMultiInsert.search(
      haystack,
      needle,
      undefined,
      infoThresh,
    );

    if (!result?.[0]?.length || !result?.[1]) {
      result = fuzzyMultiInsert.search(
        haystack,
        needle,
        outOfOrder,
        infoThresh,
      );
    }

    if (!result?.[0]?.length || !result?.[1]) {
      result = fuzzySingleError.search(
        haystack,
        needle,
        outOfOrder,
        infoThresh,
      );
    }

    if (!result?.[0]?.length || !result?.[1]) {
      result = fuzzySingleErrorFuzzier.search(
        haystack,
        needle,
        outOfOrder,
        infoThresh,
      );
    }

    if (!result?.[0]?.length || !result?.[1]) {
      result = fuzzyMultiInsertFuzzier.search(
        haystack,
        needle,
        undefined,
        infoThresh,
      );
    }

    if (!result?.[0]?.length || !result?.[1]) {
      result = fuzzyMultiInsertFuzzier.search(
        haystack,
        needle,
        outOfOrder,
        infoThresh,
      );
    }

    return result;
  });

  const resultCount = createMemo(() => searchResult()?.[0]?.length || 0);

  return (
    <div
      class="relative flex size-full flex-1 flex-col"
      style={{
        display: selectedFrame() !== "Search" ? "none" : undefined,
      }}
    >
      <div class="flex-1 space-y-1 overflow-y-auto p-4 pt-16">
        <p class="py-2 text-orange-100/75">
          <Show when={search()} fallback={"Write in the top bar to search."}>
            Found{" "}
            <span class="font-medium text-orange-400/75">
              {resultCount().toLocaleString("en-us")}
            </span>{" "}
            presets.
          </Show>
        </p>

        <Show when={search()}>
          <div class="-mx-4 border-t border-orange-200/10" />

          <div
            class="py-1"
            style={{
              display: !resultCount() ? "none" : undefined,
            }}
          >
            {(() => {
              const r = searchResult();

              if (r) {
                return (
                  <ListSection
                    haystack={haystack}
                    presets={presets}
                    searchResult={() => r}
                  />
                );
              } else {
                return undefined;
              }
            })()}
          </div>
        </Show>
      </div>

      <Box absolute="top" padded={false}>
        <div
          class="relative flex w-full cursor-text items-center space-x-0.5 px-3 py-2 hover:bg-orange-200/5"
          onClick={() => inputRef()?.focus()}
        >
          <IconTablerSearch />
          <input
            id={INPUT_PRESET_SEARCH_ID}
            ref={inputRef.set}
            class="w-full bg-transparent p-1 caret-orange-500 placeholder:text-orange-200/50 focus:outline-none"
            placeholder="Search by name or path"
            value={search()}
            onInput={(event) => search.set(event.target.value)}
          />
          <span class="-mx-1 flex size-5 flex-none items-center justify-center rounded-md border border-white text-xs font-bold">
            <IconTablerSlash />
          </span>
        </div>
      </Box>

      <Box absolute="bottom">
        <Button
          onClick={() => {
            search.set("");
            inputRef()?.focus();
          }}
        >
          Clear search
        </Button>
      </Box>
    </div>
  );
}

function ListSection({
  searchResult,
  pageIndex = 0,
  haystack,
  presets,
}: {
  searchResult: Accessor<uFuzzy.SearchResult>;
  pageIndex?: number;
  haystack: string[];
  presets: Presets;
}) {
  const div = createRWS<HTMLDivElement | undefined>(undefined);

  const useVisibilityObserver = createVisibilityObserver();

  const visible = useVisibilityObserver(div);

  const showNextPage = createMemo<boolean>(
    (previous) => previous || visible(),
    false,
  );

  const list = createMemo(() =>
    computeList({
      searchResult: searchResult(),
      pageIndex,
      haystack,
      presets,
    }),
  );

  return (
    <div>
      <For each={list()}>
        {({ preset, path, title }) => (
          <Line
            id={`search-${preset.id}`}
            name={title}
            onClick={() => presets.select(preset)}
            active={() => presets.selected() === preset}
            header={path}
          />
        )}
      </For>
      <Show when={list().length === PER_PAGE}>
        <div ref={div.set}>
          <Show when={showNextPage()}>
            <ListSection
              searchResult={searchResult}
              haystack={haystack}
              presets={presets}
              pageIndex={pageIndex + 1}
            />
          </Show>
        </div>
      </Show>
    </div>
  );
}

function computeList({
  searchResult,
  pageIndex,
  haystack,
  presets,
}: {
  searchResult: uFuzzy.SearchResult;
  pageIndex: number;
  haystack: string[];
  presets: Presets;
}) {
  let list: {
    preset: Preset;
    path: string;
    title: string;
  }[] = [];

  let [indexes, info, order] = searchResult || [null, null, null];

  const minIndex = pageIndex * PER_PAGE;

  if (indexes?.length) {
    const maxIndex = Math.min(
      (order || indexes).length - 1,
      minIndex + PER_PAGE - 1,
    );

    list = Array(maxIndex - minIndex + 1);

    if (info && order) {
      for (let i = minIndex; i <= maxIndex; i++) {
        let infoIdx = order[i];

        const [title, path] = uFuzzy
          .highlight(haystack[info.idx[infoIdx]], info.ranges[infoIdx])
          .split("\t");

        list[i % 100] = {
          preset: presets.list[info.idx[infoIdx]],
          path,
          title,
        };
      }
    } else {
      for (let i = minIndex; i <= maxIndex; i++) {
        let index = indexes[i];

        const [title, path] = haystack[index].split("\t");

        list[i % 100] = {
          preset: presets.list[index],
          path,
          title,
        };
      }
    }
  }

  return list;
}
