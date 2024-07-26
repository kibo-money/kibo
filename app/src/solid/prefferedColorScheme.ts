import { createRWS } from "./rws";

type ColorScheme = "light" | "dark";

export function createPreferredColorSchemeAccessor() {
  const preferredColorSchemeMatchMedia = window.matchMedia(
    "(prefers-color-scheme: dark)",
  );

  const preferredColorScheme = createRWS<ColorScheme>(
    preferredColorSchemeMatchMedia.matches ? "dark" : "light",
  );

  function preferredColorSchemeListener(event: MediaQueryListEvent) {
    return preferredColorScheme.set(event.matches ? "dark" : "light");
  }

  preferredColorSchemeMatchMedia.addEventListener(
    "change",
    preferredColorSchemeListener,
  );

  onCleanup(() => {
    preferredColorSchemeMatchMedia.removeEventListener(
      "change",
      preferredColorSchemeListener,
    );
  });

  return preferredColorScheme satisfies Accessor<ColorScheme>;
}
