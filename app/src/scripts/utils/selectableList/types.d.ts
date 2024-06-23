// ---
// JSON
// ---

interface JSONSelectableList<T, L extends T[] = T[]> {
  readonly version: 1;
  selectedIndex: number | null;
  readonly list: L;
}

// ---
// Object
// ---

interface SelectableList<T, L extends T[] = T[]> {
  readonly selected: Accessor<T | null>;
  readonly selectedIndex: Accessor<number | null>;
  readonly list: RWS<L>;
  readonly select: <S extends L[number] = L[number]>(s: S) => void;
  readonly selectFind: <K>(
    search: K,
    callback: (element: T) => K,
  ) => T | undefined;
  readonly selectIndex: (i: number | null) => void;
  readonly push: <S extends L[number] = L[number]>(s: S) => void;
  readonly pushAndSelect: <S extends L[number] = L[number]>(s: S) => void;
  readonly removeIndex: (i: number) => L[number] | null;
  readonly resetSelected: VoidFunction;
  readonly toJSON: <TJSON, LJSON extends TJSON[] = TJSON[]>(
    transform: (value: T) => LJSON[number],
    filter?: (value: T) => boolean,
  ) => JSONSelectableList<TJSON, LJSON>;
}
