function convertSignalToReadWriteSignal<T>(signal: Signal<T>) {
  const getter = signal[0] as Accessor<T> & {
    set?: Setter<T>;
  };

  getter.set = signal[1];

  return getter as ReadWriteSignal<T>;
};

export function createReadWriteSignal<T>(
  value: T,
  options?: SignalOptions<T>,
) {
  return convertSignalToReadWriteSignal(createSignal(value, options));
}

export const createRWS = createReadWriteSignal;
