export function saveToStorage(key?: string, value?: string | boolean) {
  if (key) {
    value !== undefined && value !== null
      ? localStorage.setItem(key, String(value))
      : localStorage.removeItem(key);
  }
}

export function readBooleanFromStorage(key: string) {
  const saved = localStorage.getItem(key);
  if (saved) {
    return isSerializedBooleanTrue(saved);
  }
  return null;
}

export function isSerializedBooleanTrue(serialized: string) {
  return serialized === "true" || serialized === "1";
}
