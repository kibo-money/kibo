import { requestIdleCallbackPossible } from "../env";
import { createRWS } from "./rws";

export function createWasIdleAccessor() {
  const wasIdle = createRWS(false);

  if (requestIdleCallbackPossible) {
    const idleCallback = requestIdleCallback(() => {
      wasIdle.set(true);
    });

    onCleanup(() => {
      cancelIdleCallback(idleCallback);
    });
  } else {
    const timeout = setTimeout(() => {
      wasIdle.set(true);
    }, 500);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  }

  return wasIdle as Accessor<boolean>;
}
