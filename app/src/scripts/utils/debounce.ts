export const debounce = <F extends (...args: any[]) => any>(
  callback: F,
  wait = 250,
) => {
  let timeoutId: number | undefined;
  let latestArgs: Parameters<F>;

  return (...args: Parameters<F>) => {
    latestArgs = args;

    if (!timeoutId) {
      timeoutId = window.setTimeout(async () => {
        await callback(...latestArgs);

        timeoutId = undefined;
      }, wait);
    }
  };
};
