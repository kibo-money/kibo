type ReadWriteSignal<T> = Accessor<T> & {
  readonly set: Setter<T>;
};

type RWS<T> = ReadWriteSignal<T>;
