export function sortedInsert(array: number[], value: number) {
  let low = 0;
  let high = array.length;

  while (low < high) {
    const mid = (low + high) >>> 1;

    if (array[mid] < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  array.splice(low, 0, value);
}
