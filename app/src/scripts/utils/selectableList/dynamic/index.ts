import { createRWS } from "/src/solid/rws";

export const createDynamicList = <T, L extends T[] = T[]>(
  l: L,
  parameters?: {
    selected?: L[number];
    selectedIndex?: number | null;
  },
) => {
  const selected = createRWS<L[number] | null>(null);
  const selectedIndex = createRWS<number | null>(null);

  const list: DynamicList<L[number], L> = {
    selected,
    selectedIndex,
    list: createRWS(l, {
      equals: false,
    }),
    select(s) {
      if (this.selected() !== s) {
        batch(() => {
          selected.set(() => s);
          this.selectIndex(this.list().indexOf(s) ?? null);
        });
      }
    },
    resetSelected() {
      selected.set(null);
      selectedIndex.set(null);
    },
    selectFind(search, callback) {
      const element = this.list().find(
        (_element) => callback(_element) === search,
      );

      if (element) {
        this.select(element);
      }

      return element;
    },
    selectIndex(i) {
      i = i === -1 ? null : i;

      if (i && (i < 0 || i >= this.list().length)) {
        throw new Error(
          `SelectableList: selectIndex: ${i} is incorrect ! (has ${
            this.list().length
          } elements)`,
        );
      }

      if (i !== this.selectedIndex()) {
        selectedIndex.set(i);

        const value = getValueFromIndexInList<L[number]>(i, this.list());

        if (value !== null) {
          this.select(value);
        }
      }
    },
    push(value) {
      this.list.set((l) => {
        l.push(value);
        return l;
      });
    },
    pushAndSelect(value) {
      batch(() => {
        this.push(value);
        this.select(value);
      });
    },
    removeIndex(index) {
      let value = null;
      this.list.set((l) => {
        value = l.splice(index, 1)?.[0];
        return l;
      });
      return value;
    },
    toJSON<TJSON, LJSON extends TJSON[] = TJSON[]>(
      transform: (value: T) => TJSON,
      filter?: (value: T) => boolean,
    ): JSONDynamicList<TJSON, LJSON> {
      return {
        version: 1,
        selectedIndex: getIndexOfSelectedInDynamicList(this),
        list: (filter ? this.list().filter(filter) : this.list()).map((value) =>
          transform(value),
        ) as LJSON,
      };
    },
  };

  if (parameters?.selected !== undefined) {
    list.select(parameters.selected);
  } else if (parameters?.selectedIndex !== undefined) {
    list.selectIndex(parameters.selectedIndex);
  }

  return list;
};

export const createDSL = createDynamicList;

export const getIndexOfSelectedInDynamicList = <T, L extends T[] = T[]>(
  sl: DynamicList<L[number], L>,
) => {
  const selected = sl.selected();

  return selected ? sl.list().indexOf(selected) : null;
};

const getValueFromIndexInList = <T, L extends T[] = T[]>(
  index: number | null,
  list: L,
) => (index !== null && list.length > 0 ? list.at(index) || list[0] : null);
