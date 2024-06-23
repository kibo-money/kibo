import { replaceHistory } from "./history";
import { isSerializedBooleanTrue } from "./storage";

const whitelist = ["from", "to"];

export function resetURLParams() {
  const urlParams = new URLSearchParams();

  [...new URLSearchParams(window.location.search).entries()]
    .filter(([key, _]) => whitelist.includes(key))
    .forEach(([key, value]) => {
      urlParams.set(key, value);
    });

  replaceHistory({ urlParams });
}

export function writeURLParam(key: string, value?: string | boolean) {
  const urlParams = new URLSearchParams(window.location.search);

  if (value !== undefined) {
    urlParams.set(key, String(value));
  } else {
    urlParams.delete(key);
  }

  replaceHistory({ urlParams });
}

export function readBooleanURLParam(key: string) {
  const urlParams = new URLSearchParams(window.location.search);

  const parameter = urlParams.get(key);

  if (parameter) {
    return isSerializedBooleanTrue(parameter);
  }

  return null;
}
