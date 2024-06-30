import { createRWS } from "/src/solid/rws";

import { run } from "../../run";

export const createStaticList = <T, L extends T[] = T[]>(
  l: L,
  parameters: {
    selected?: L[number];
    selectedIndex?: number;
    saveable?: {
      mode: "localStorage" | "URLParams" | "both";
      key: string;
    };
    defaultValue?: L[number];
    defaultIndex?: number;
  },
) => {
  if (
    !l.length ||
    (parameters.saveable === undefined &&
      parameters.selected === undefined &&
      parameters.selectedIndex === undefined)
  ) {
    throw Error("not possible");
  }

  const selected = createRWS<L[number]>(
    run(() => {
      let savedIndex: number | undefined;

      if (parameters.saveable) {
        if (parameters.saveable.mode !== "localStorage") {
          throw Error("unsupported");
        }

        const savedRaw = localStorage.getItem(parameters.saveable.key);

        if (savedRaw) {
          savedIndex = Number(savedRaw);
        }
      }

      if (parameters.selected) {
        const found = l.find((v) => v === parameters.selected);

        if (!found) {
          throw Error("unreachable");
        }

        return found;
      } else {
        return (
          l.at(savedIndex ?? parameters.selectedIndex!) ??
          parameters.defaultValue ??
          l[parameters.defaultIndex || 0]
        );
      }
    }),
  );

  const selectedIndex = createRWS<number>(
    run(() => {
      if (
        parameters.selectedIndex !== null &&
        parameters.selectedIndex !== undefined
      ) {
        const found = l.at(parameters.selectedIndex);

        if (!found) {
          throw Error("unreachable");
        }

        return parameters.selectedIndex;
      } else {
        return l.indexOf(selected());
      }
    }),
  );

  createEffect(() => {
    if (parameters.saveable) {
      localStorage.setItem(parameters.saveable.key, String(selectedIndex()));
    }
  });

  const list: StaticList<L[number], L> = {
    selected,
    selectedIndex,
    list: createRWS(l, {
      equals: false,
    }),
    select(s) {
      if (this.selected() !== s) {
        batch(() => {
          selected.set(() => s);
          this.selectIndex(this.list().indexOf(s));
        });
      }
    },
    selectIndex(i) {
      if (i && (i < 0 || i >= this.list().length)) {
        throw new Error(
          `SelectableList: selectIndex: ${i} is incorrect ! (has ${
            this.list().length
          } elements)`,
        );
      }

      if (i !== this.selectedIndex()) {
        selectedIndex.set(i);

        const value = this.list().at(i);

        if (value === undefined) {
          throw Error("unreachable");
        }

        this.select(value);
      }
    },
  };

  if (parameters?.selected !== undefined) {
    list.select(parameters.selected);
  } else if (parameters?.selectedIndex !== undefined) {
    list.selectIndex(parameters.selectedIndex);
  }

  return list;
};

export const createSL = createStaticList;

export const getIndexOfSelectedInStaticList = <T, L extends T[] = T[]>(
  sl: StaticList<L[number], L>,
) => {
  const selected = sl.selected();

  return selected ? sl.list().indexOf(selected) : null;
};
