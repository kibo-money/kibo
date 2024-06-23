export function random<T>(array: T[]) {
  if (array && array.length) {
    return array[Math.floor(Math.random() * array.length)];
  }
}
