// @ts-check

/**
 * @import { SignalOptions } from "./2024-11-02/types/core/core"
 * @import { getOwner as GetOwner, onCleanup as OnCleanup, Owner } from "./2024-11-02/types/core/owner"
 * @import { createSignal as CreateSignal, createEffect as CreateEffect, Accessor, Setter, createMemo as CreateMemo, createRoot as CreateRoot, runWithOwner as RunWithOwner } from "./2024-11-02/types/signals";
 * @import { Signal } from "./types";
 */

const importSignals = import("./2024-11-02/script.js").then((_signals) => {
  const signals = {
    createSolidSignal: /** @type {CreateSignal} */ (_signals.createSignal),
    createSolidEffect: /** @type {CreateEffect} */ (_signals.createEffect),
    createEffect: /** @type {CreateEffect} */ (compute, effect) => {
      let dispose = /** @type {VoidFunction | null} */ (null);
      // @ts-ignore
      _signals.createEffect(compute, (v) => {
        dispose?.();
        signals.createRoot((_dispose) => {
          dispose = _dispose;
          effect(v);
        });
        signals.onCleanup(() => dispose?.());
      });
      signals.onCleanup(() => dispose?.());
    },
    createMemo: /** @type {CreateMemo} */ (_signals.createMemo),
    createRoot: /** @type {CreateRoot} */ (_signals.createRoot),
    getOwner: /** @type {GetOwner} */ (_signals.getOwner),
    runWithOwner: /** @type {RunWithOwner} */ (_signals.runWithOwner),
    onCleanup: /** @type {OnCleanup} */ (_signals.onCleanup),
    flushSync: _signals.flushSync,
    /**
     * @template T
     * @param {T} initialValue
     * @param {SignalOptions<T> & {save?: {keyPrefix: string; key: string; serialize: (v: NonNullable<T>) => string; deserialize: (v: string) => NonNullable<T>}}} [options]
     * @returns {Signal<T>}
     */
    createSignal(initialValue, options) {
      const [get, set] = this.createSolidSignal(
        /** @type {any} */ (initialValue),
        options,
      );

      // @ts-ignore
      get.set = set;

      // @ts-ignore
      get.reset = () => set(initialValue);

      if (options?.save) {
        const save = options.save;

        const paramKey = save.key;
        const storageKey = `${save.keyPrefix}-${paramKey}`;

        let serialized = /** @type {string | null} */ (null);
        serialized = new URLSearchParams(window.location.search).get(paramKey);

        if (serialized === null) {
          serialized = localStorage.getItem(storageKey);
        }
        if (serialized) {
          set(save.deserialize(serialized));
        }

        let firstEffect = true;
        this.createEffect(get, (value) => {
          if (!save) return;

          if (!firstEffect) {
            if (
              value !== undefined &&
              value !== null &&
              (initialValue === undefined ||
                initialValue === null ||
                save.serialize(value) !== save.serialize(initialValue))
            ) {
              localStorage.setItem(storageKey, save.serialize(value));
            } else {
              localStorage.removeItem(storageKey);
            }
          }

          if (
            value !== undefined &&
            value !== null &&
            (initialValue === undefined ||
              initialValue === null ||
              save.serialize(value) !== save.serialize(initialValue))
          ) {
            writeParam(paramKey, save.serialize(value));
          } else {
            removeParam(paramKey);
          }

          firstEffect = false;
        });
      }

      // @ts-ignore
      return get;
    },
  };

  return signals;
});

/**
 * @param {string} key
 * @param {string | undefined} value
 */
function writeParam(key, value) {
  const urlParams = new URLSearchParams(window.location.search);

  if (value !== undefined) {
    urlParams.set(key, String(value));
  } else {
    urlParams.delete(key);
  }

  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${urlParams.toString()}`,
  );
}

/**
 * @param {string} key
 */
function removeParam(key) {
  writeParam(key, undefined);
}

export default importSignals;
