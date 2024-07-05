import { createRWS } from "/src/solid/rws";

import { standalone } from "../env";
import { createDatasets } from "../scripts/datasets";
import { createPresets } from "../scripts/presets";
import { createSL } from "../scripts/utils/selectableList/static";
import { sleep } from "../scripts/utils/sleep";
import {
  readBooleanFromStorage,
  saveToStorage,
} from "../scripts/utils/storage";
import { readBooleanURLParam, writeURLParam } from "../scripts/utils/urlParams";
import { webSockets } from "../scripts/ws";
import { classPropToString } from "../solid/classes";
import { Background } from "./components/background";
import { ChartFrame } from "./components/frames/chart";
import { FavoritesFrame } from "./components/frames/favorites";
import { FoldersFrame } from "./components/frames/folders";
import { HistoryFrame } from "./components/frames/history";
import { SettingsFrame } from "./components/frames/settings";
import { Qrcode } from "./components/qrcode";
import { StripDesktop, StripMobile } from "./components/strip";
import { Update } from "./components/update";

const LOCAL_STORAGE_BAR_KEY = "bar-width";
const LOCAL_STORAGE_FULLSCREEN = "fullscrenn";

export const INPUT_PRESET_SEARCH_ID = "input-search-preset";

export function App() {
  const tabFocused = createRWS(true);
  const qrcode = createRWS("");

  const appTheme = createSL(["System", "Dark", "Light"] as const, {
    saveable: {
      key: "app-theme",
      mode: "localStorage",
    },
    defaultIndex: 0,
  });

  const dark = createRWS(false);

  createEffect(() => {
    if (
      appTheme.selected() === "Dark" ||
      (appTheme.selected() === "System" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      dark.set(true);
      document.documentElement.classList.add("dark");
    } else {
      dark.set(false);
      document.documentElement.classList.remove("dark");
    }
  });

  const backgroundMode = createSL(["Scroll", "Static"] as const, {
    saveable: {
      key: "bg-mode",
      mode: "localStorage",
    },
    defaultIndex: 0,
  });

  const backgroundOpacity = createSL(
    [
      {
        text: "Strong",
        value: 0.0444,
      },
      {
        text: "Normal",
        value: 0.0333,
      },
      {
        text: "Light",
        value: 0.0222,
      },
      {
        text: "Subtle",
        value: 0.0111,
      },
    ] as const,
    {
      saveable: {
        key: "bg-text-opacity",
        mode: "localStorage",
      },
      defaultIndex: 2,
    },
  );

  const fullscreen = createRWS(
    readBooleanURLParam(LOCAL_STORAGE_FULLSCREEN) ||
      readBooleanFromStorage(LOCAL_STORAGE_FULLSCREEN) ||
      false,
  );

  const windowWidth = createRWS(window.innerWidth);
  const windowWidth60p = createMemo(() => windowWidth() * 0.6);
  const windowResizeCallback = () => {
    windowWidth.set(window.innerWidth);
  };
  window.addEventListener("resize", windowResizeCallback);
  onCleanup(() => window.removeEventListener("resize", windowResizeCallback));

  const windowSizeIsAtLeastMedium = createMemo(() => windowWidth() >= 768);

  const minBarWidth = 384;
  const barWidth = createRWS(
    Number(localStorage.getItem(LOCAL_STORAGE_BAR_KEY)) || minBarWidth,
  );

  createEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_BAR_KEY, String(barWidth()));
  });

  createEffect(() => {
    if (fullscreen()) {
      writeURLParam(LOCAL_STORAGE_FULLSCREEN, "true");
      saveToStorage(LOCAL_STORAGE_FULLSCREEN, fullscreen());
    } else {
      writeURLParam(LOCAL_STORAGE_FULLSCREEN, undefined);
      saveToStorage(LOCAL_STORAGE_FULLSCREEN, undefined);
    }
  });

  const _selectedFrame = createRWS<FrameName>("Chart");

  const selectedFrame = createMemo(() =>
    windowSizeIsAtLeastMedium() && _selectedFrame() === "Chart"
      ? "Folders"
      : _selectedFrame(),
  );

  const presets = createPresets();

  const resizingBarStart = createRWS<number | undefined>(undefined);
  const resizingBarWidth = createRWS<number>(0);

  createEffect(
    () => {
      if (!windowSizeIsAtLeastMedium() && presets.selected()) {
        _selectedFrame.set("Chart");
      }
    },
    {
      deffer: true,
    },
  );

  const datasets = createDatasets();

  onMount(() => {
    webSockets.openAll();

    createEffect(() => {
      const latest = webSockets.liveKrakenCandle.latest();

      if (latest) {
        const close = latest.close;

        console.log("close:", close);

        document.title = `${latest.close.toLocaleString("en-us")} | Satonomics`;
      }
    });
  });

  const documentVisibilityChange = () =>
    tabFocused.set(document.visibilityState === "visible");
  document.addEventListener("visibilitychange", documentVisibilityChange);
  onCleanup(() =>
    document.removeEventListener("visibilitychange", documentVisibilityChange),
  );

  const documentOnKeyDown = async (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape": {
        event.stopPropagation();
        event.preventDefault();

        _selectedFrame.set("Chart");

        break;
      }
      case "/": {
        event.stopPropagation();
        event.preventDefault();

        _selectedFrame.set("Search");

        await sleep(50);

        document.getElementById(INPUT_PRESET_SEARCH_ID)?.focus();

        break;
      }
    }
  };
  document.addEventListener("keydown", documentOnKeyDown);
  onCleanup(() => document.removeEventListener("keydown", documentOnKeyDown));

  const resizeInitialRange = createRWS<TimeRange | null>(null);

  const SearchFrame = lazy(() =>
    import("./components/frames/search").then((d) => ({
      default: d.SearchFrame,
    })),
  );

  return (
    <>
      <Background
        focused={tabFocused}
        mode={backgroundMode}
        opacity={backgroundOpacity}
      />

      <div
        class="relative h-dvh selection:bg-orange-800"
        style={{
          "user-select": resizingBarStart() !== undefined ? "none" : undefined,
        }}
        onMouseMove={(event) => {
          const startingClientX = resizingBarStart();

          if (startingClientX !== undefined) {
            barWidth.set(
              Math.min(
                Math.max(
                  resizingBarWidth() + event.clientX - startingClientX,
                  minBarWidth,
                ),
                windowWidth60p(),
              ),
            );
          }
        }}
        onMouseUp={() => resizingBarStart.set(undefined)}
        onMouseLeave={() => resizingBarStart.set(undefined)}
        onTouchEnd={() => resizingBarStart.set(undefined)}
        onTouchCancel={() => resizingBarStart.set(undefined)}
      >
        <Qrcode qrcode={qrcode} />
        <Update />

        <div class="flex size-full flex-col md:flex-row md:p-3 md:short:p-0">
          <Show when={!windowSizeIsAtLeastMedium() || !fullscreen()}>
            <div
              class={classPropToString([
                standalone && "border-t md:border-t-0",
                "border-lighter flex h-full flex-col overflow-hidden bg-gradient-to-b from-orange-300/15 to-orange-400/15 dark:from-orange-500/10 dark:to-orange-950/10 md:flex-row md:rounded-2xl md:border md:shadow-md md:short:hidden",
              ])}
            >
              <div class="border-lighter hidden flex-col gap-2 border-r bg-orange-300/30 p-3 backdrop-blur-sm dark:bg-black/30 md:flex">
                <StripDesktop
                  selected={selectedFrame}
                  setSelected={_selectedFrame.set}
                />
              </div>
              <div
                class="flex h-full min-h-0"
                style={{
                  ...(windowSizeIsAtLeastMedium()
                    ? {
                        "min-width": `${minBarWidth}px`,
                        width: `${barWidth()}px`,
                        "max-width": `${windowWidth60p()}px`,
                      }
                    : {}),
                }}
              >
                <Show when={!windowSizeIsAtLeastMedium()}>
                  <ChartFrame
                    presets={presets}
                    hide={() => selectedFrame() !== "Chart"}
                    qrcode={qrcode}
                    standalone={false}
                    datasets={datasets}
                    dark={dark}
                  />
                </Show>

                <FoldersFrame presets={presets} selectedFrame={selectedFrame} />
                <FavoritesFrame
                  presets={presets}
                  selectedFrame={selectedFrame}
                />
                <SearchFrame presets={presets} selectedFrame={selectedFrame} />
                <HistoryFrame presets={presets} selectedFrame={selectedFrame} />
                <SettingsFrame
                  selectedFrame={selectedFrame}
                  appTheme={appTheme}
                  backgroundMode={backgroundMode}
                  backgroundOpacity={backgroundOpacity}
                />
              </div>

              <div
                class={classPropToString([
                  standalone && "pb-6",
                  "border-lighter flex justify-between gap-3 border-t bg-black/30 p-2 backdrop-blur-sm sm:justify-around md:hidden short:hidden",
                ])}
              >
                <StripMobile
                  selected={selectedFrame}
                  setSelected={_selectedFrame.set}
                />
              </div>
            </div>
          </Show>

          <Show when={!fullscreen()}>
            <div
              class="mx-[3px] my-8 hidden w-[6px] cursor-col-resize items-center justify-center rounded-full bg-orange-900 opacity-0 hover:opacity-50 dark:bg-orange-100 md:block short:hidden"
              onMouseDown={(event) => {
                if (resizingBarStart() === undefined) {
                  resizingBarStart.set(event.clientX);
                  resizingBarWidth.set(barWidth());
                }
              }}
              onTouchStart={(event) => {
                if (resizingBarStart() === undefined) {
                  resizingBarStart.set(event.touches[0].clientX);
                  resizingBarWidth.set(barWidth());
                }
              }}
              onDblClick={() => {
                barWidth.set(0);
              }}
            />
          </Show>

          <Show when={windowSizeIsAtLeastMedium()}>
            <div class="flex min-w-0 flex-1">
              <ChartFrame
                standalone={true}
                presets={presets}
                qrcode={qrcode}
                fullscreen={fullscreen}
                datasets={datasets}
                dark={dark}
              />
            </div>
          </Show>
        </div>
      </div>
    </>
  );
}
