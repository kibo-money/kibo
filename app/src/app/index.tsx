import { createRWS } from "/src/solid/rws";

import { env } from "../env";
import { createDatasets } from "../scripts/datasets";
import { chartState } from "../scripts/lightweightCharts/chart/state";
import { setTimeScale } from "../scripts/lightweightCharts/chart/time";
import { createPresets } from "../scripts/presets";
import { priceToUSLocale } from "../scripts/utils/locale";
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
import { TreeFrame } from "./components/frames/tree";
import { StripDesktop, StripMobile } from "./components/strip";
import { registerServiceWorker } from "./scripts/register";

const LOCAL_STORAGE_BAR_KEY = "bar-width";
const LOCAL_STORAGE_FULLSCREEN = "fullscrenn";

export const INPUT_PRESET_SEARCH_ID = "input-search-preset";

export function App() {
  const needRefresh = registerServiceWorker().needRefresh[0];

  const tabFocused = createRWS(true);

  const qrcode = createRWS("");

  const fullscreen = createRWS(
    readBooleanURLParam(LOCAL_STORAGE_FULLSCREEN) ||
      readBooleanFromStorage(LOCAL_STORAGE_FULLSCREEN) ||
      false,
  );

  const activeResources = createRWS<Set<ResourceDataset<any, any>>>(new Set(), {
    equals: false,
  });

  const datasets = createDatasets({
    setActiveResources: activeResources.set,
  });

  const windowWidth = createRWS(window.innerWidth);
  const windowResizeCallback = () => {
    windowWidth.set(window.innerWidth);
  };
  window.addEventListener("resize", windowResizeCallback);
  onCleanup(() => window.removeEventListener("resize", windowResizeCallback));

  const windowSizeIsAtLeastMedium = createMemo(() => windowWidth() >= 720);

  const barWidth = createRWS(
    Number(localStorage.getItem(LOCAL_STORAGE_BAR_KEY)),
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

  const presets = createPresets(datasets);

  const marquee = createRWS(!localStorage.getItem(LOCAL_STORAGE_MARQUEE_KEY));

  const resizingBarStart = createRWS<number | undefined>(undefined);

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

  const FavoritesFrame = lazy(() =>
    import("./components/frames/favorites").then((d) => ({
      default: d.FavoritesFrame,
    })),
  );
  const HistoryFrame = lazy(() =>
    import("./components/frames/history").then((d) => ({
      default: d.HistoryFrame,
    })),
  );
  const SearchFrame = lazy(() =>
    import("./components/frames/search").then((d) => ({
      default: d.SearchFrame,
    })),
  );
  const SettingsFrame = lazy(() =>
    import("./components/frames/settings").then((d) => ({
      default: d.SettingsFrame,
    })),
  );
  const Qrcode = lazy(() =>
    import("./components/qrcode").then((d) => ({
      default: d.Qrcode,
    })),
  );

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
          const start = resizingBarStart();

          if (start !== undefined) {
            barWidth.set(event.x - start + 384);

            setTimeScale(resizeInitialRange());
          }
        }}
        onMouseUp={() => resizingBarStart.set(undefined)}
        onMouseLeave={() => resizingBarStart.set(undefined)}
        onTouchEnd={() => resizingBarStart.set(undefined)}
        onTouchCancel={() => resizingBarStart.set(undefined)}
      >
        <Qrcode qrcode={qrcode} />

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
                  needsRefresh={needRefresh}
                />
              </div>
              <div
                class="flex h-full min-h-0 md:min-w-[384px]"
                style={{
                  ...(windowSizeIsAtLeastMedium()
                    ? {
                        width: `min(${barWidth()}px, 75dvw)`,
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

                resizingBarStart() === undefined &&
                  // TODO: set size of bar instead
                  resizingBarStart.set(event.clientX);
              }}
              onTouchStart={(event) => {
                resizeInitialRange.set(chartState.range);

                resizingBarStart() === undefined &&
                  resizingBarStart.set(event.touches[0].clientX);
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
