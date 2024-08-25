import { createRWS } from "/src/solid/rws";

import { standalone } from "../env";
import { createDatasets } from "../scripts/datasets";
import { createPresets } from "../scripts/presets";
import { createUserConfig } from "../scripts/user/config";
import { sleep } from "../scripts/utils/sleep";
import {
  readBooleanFromStorage,
  saveToStorage,
} from "../scripts/utils/storage";
import { readBooleanURLParam, writeURLParam } from "../scripts/utils/urlParams";
import { webSockets } from "../scripts/ws";
import { classPropToString } from "../solid/classes";
import { ChartFrame } from "./frames/chart";
import { FoldersFrame } from "./frames/folders";
import { HistoryFrame } from "./frames/history";
import { SettingsFrame } from "./frames/settings";
import { StripDesktop, StripMobile } from "./strip";
import { Update } from "./update";

const LOCAL_STORAGE_BAR_KEY = "bar-width";
const LOCAL_STORAGE_FULLSCREEN = "fullscrenn";

export const INPUT_PRESET_SEARCH_ID = "input-search-preset";

export function App() {
  const tabFocused = createRWS(true);
  const qrcode = createRWS("");
  const dark = createRWS(false);

  const userConfig = createUserConfig({
    dark,
  });

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

  const SearchFrame = lazy(() =>
    import("./frames/search").then((d) => ({
      default: d.SearchFrame,
    })),
  );

  const Qrcode = lazy(() =>
    import("./qrcode").then((d) => ({
      default: d.Qrcode,
    })),
  );

  return (
    <>
      <div
        class="relative h-dvh"
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
        <Show when={qrcode()}>
          <Qrcode qrcode={qrcode} />
        </Show>

        <Update />

        <div class="flex size-full flex-col md:flex-row">
          <Show when={!windowSizeIsAtLeastMedium() || !fullscreen()}>
            <div
              class={classPropToString([
                standalone && "border-t md:border-t-0",
                "flex h-full flex-col overflow-hidden md:flex-row md:shadow-md md:short:hidden",
              ])}
            >
              <div class="hidden flex-col gap-2 border-r px-3 py-4 backdrop-blur-sm md:flex">
                <StripDesktop
                  selected={selectedFrame}
                  setSelected={_selectedFrame.set}
                />
              </div>
              <div
                class="relative flex h-full min-h-0"
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
                <SearchFrame presets={presets} selectedFrame={selectedFrame} />
                <HistoryFrame presets={presets} selectedFrame={selectedFrame} />
                <SettingsFrame
                  selectedFrame={selectedFrame}
                  appTheme={userConfig.settings.appTheme}
                  backgroundMode={userConfig.settings.background.mode}
                  backgroundOpacity={userConfig.settings.background.opacity}
                />

                <div class="absolute bottom-0 left-0 right-0 z-10 h-6 w-full bg-gradient-to-b from-transparent to-[var(--background-color)]" />
              </div>

              <div
                class={classPropToString([
                  standalone && "pb-6",
                  "flex justify-between gap-3 border-t p-2 sm:justify-around md:hidden short:hidden",
                ])}
              >
                <StripMobile
                  selected={selectedFrame}
                  setSelected={_selectedFrame.set}
                />
              </div>
            </div>
          </Show>

          {/* <Show when={!fullscreen()}>
            <div
              class="mx-[3px] my-8 hidden w-[6px] cursor-col-resize items-center justify-center rounded-full opacity-0 hover:opacity-50 md:block short:hidden"
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
          </Show> */}

          <Show when={windowSizeIsAtLeastMedium()}>
            <div class="flex min-w-0 flex-1 border-l">
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
