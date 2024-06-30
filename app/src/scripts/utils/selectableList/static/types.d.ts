interface StaticList<T, L extends T[] = T[]> {
  readonly selected: Accessor<T>;
  readonly selectedIndex: Accessor<number>;
  readonly list: RWS<L>;
  readonly select: <S extends L[number] = L[number]>(s: S) => void;
  readonly selectIndex: (index: number) => void;
}

type SL<T, L extends T[] = T[]> = StaticList<T, L>;
