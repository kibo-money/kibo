import { createRWS } from "/src/solid/rws";

import { env } from "../env";
import { createDatasets } from "../scripts/datasets";
import { chartState } from "../scripts/lightweightCharts/chart/state";
import { setTimeScale } from "../scripts/lightweightCharts/chart/time";
import { createPresets } from "../scripts/presets";
import { priceToUSLocale } from "../scripts/utils/locale";
import { run } from "../scripts/utils/run";
import { sleep } from "../scripts/utils/sleep";
import {
  readBooleanFromStorage,
  saveToStorage,
} from "../scripts/utils/storage";
import { readBooleanURLParam, writeURLParam } from "../scripts/utils/urlParams";
import { webSockets } from "../scripts/ws";
import { classPropToString } from "../solid/classes";
import { Background, LOCAL_STORAGE_MARQUEE_KEY } from "./components/background";
import { ChartFrame } from "./components/frames/chart";
import { FavoritesFrame } from "./components/frames/favorites";
import { HistoryFrame } from "./components/frames/history";
import { SearchFrame } from "./components/frames/search";
import { SettingsFrame } from "./components/frames/settings";
import { TreeFrame } from "./components/frames/tree";
import { Qrcode } from "./components/qrcode";
import { StripDesktop, StripMobile } from "./components/strip";
import { Update } from "./components/update";

const LOCAL_STORAGE_BAR_KEY = "bar-width";
const LOCAL_STORAGE_FULLSCREEN = "fullscrenn";

export const INPUT_PRESET_SEARCH_ID = "input-search-preset";

export function App() {
  const tabFocused = createRWS(true);

  const qrcode = createRWS("");

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

  const windowSizeIsAtLeastMedium = createMemo(() => windowWidth() >= 720);

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
      ? "Tree"
      : _selectedFrame(),
  );

  const presets = createPresets();

  const marquee = createRWS(!localStorage.getItem(LOCAL_STORAGE_MARQUEE_KEY));

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

  const activeResources = createRWS<Set<ResourceDataset<any, any>>>(new Set(), {
    equals: false,
  });

  // Can't put datasets inside a signal as it breaks lazy memo

  const datasets = createDatasets({
    setActiveResources: activeResources.set,
  });

  onMount(() => {
    webSockets.openAll();

    createEffect(() => {
      const latest = webSockets.liveKrakenCandle.latest();

      if (latest) {
        const close = latest.close;

        console.log("close:", close);

        document.title = `${priceToUSLocale(latest.close, false)} | Satonomics`;
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

  return (
    <>
      <Background marquee={marquee} focused={tabFocused} />

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

            setTimeScale(resizeInitialRange());
          }
        }}
        onMouseUp={() => resizingBarStart.set(undefined)}
        onMouseLeave={() => resizingBarStart.set(undefined)}
        onTouchEnd={() => resizingBarStart.set(undefined)}
        onTouchCancel={() => resizingBarStart.set(undefined)}
      >
        <Qrcode qrcode={qrcode} />
        <Update />

        <div class="flex size-full flex-col md:flex-row md:p-3">
          <Show when={!windowSizeIsAtLeastMedium() || !fullscreen()}>
            <div
              class={classPropToString([
                env.standalone && "border-t",
                "flex h-full flex-col overflow-hidden border-white/10 bg-gradient-to-b from-orange-500/10 to-orange-950/10 md:flex-row md:rounded-2xl md:border",
              ])}
            >
              <div class="hidden flex-col gap-2 border-r border-white/10 bg-black/30 p-3 backdrop-blur-sm md:flex">
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
                    activeResources={activeResources}
                  />
                </Show>

                <TreeFrame presets={presets} selectedFrame={selectedFrame} />
                <FavoritesFrame
                  presets={presets}
                  selectedFrame={selectedFrame}
                />
                <SearchFrame presets={presets} selectedFrame={selectedFrame} />
                <HistoryFrame presets={presets} selectedFrame={selectedFrame} />
                <SettingsFrame
                  marquee={marquee}
                  selectedFrame={selectedFrame}
                />
              </div>

              <div
                class={classPropToString([
                  env.standalone && "pb-6",
                  "flex justify-between gap-3 border-t border-white/10 bg-black/30 p-2 backdrop-blur-sm md:hidden",
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
              class="mx-[3px] my-8 hidden w-[6px] cursor-col-resize items-center justify-center rounded-full bg-orange-100 opacity-0 hover:opacity-50 md:block"
              onMouseDown={(event) => {
                resizeInitialRange.set(chartState.range);

                if (resizingBarStart() === undefined) {
                  resizingBarStart.set(event.clientX);
                  resizingBarWidth.set(barWidth());
                }
              }}
              onTouchStart={(event) => {
                resizeInitialRange.set(chartState.range);

                if (resizingBarStart() === undefined) {
                  resizingBarStart.set(event.touches[0].clientX);
                  resizingBarWidth.set(barWidth());
                }
              }}
              onDblClick={() => {
                resizeInitialRange.set(chartState.range);
                barWidth.set(0);
                setTimeScale(resizeInitialRange());
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
                activeResources={activeResources}
                datasets={datasets}
              />
            </div>
          </Show>
        </div>
      </div>
    </>
  );
}
