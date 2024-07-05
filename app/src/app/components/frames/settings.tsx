import { version } from "/src/../package.json";
import { classPropToString } from "/src/solid/classes";

import { Header } from "./header";

export function SettingsFrame({
  selectedFrame,
  appTheme,
  backgroundMode,
  backgroundOpacity,
}: {
  selectedFrame: Accessor<FrameName>;
  appTheme: SL<"System" | "Dark" | "Light">;
  backgroundMode: SL<"Scroll" | "Static">;
  backgroundOpacity: SL<{ text: string; value: number }>;
}) {
  return (
    <div
      class="flex-1 overflow-y-auto"
      style={{
        display: selectedFrame() !== "Settings" ? "none" : undefined,
      }}
    >
      <div class="space-y-4 p-4">
        <Header title="Settings">And other stuff</Header>

        <div class="border-lighter -mx-4 border-t" />

        <div class="space-y-4">
          <p class="text-base font-medium">General</p>

          <RadioGroup
            title="Theme"
            ariaTitle="App's theme"
            description="Options for the app's theme"
            sl={appTheme}
          />
        </div>

        <div class="border-lighter -mx-4 border-t" />

        <div class="space-y-4">
          <p class="text-base font-medium">Background</p>

          <RadioGroup
            title="Mode"
            ariaTitle="Background mode"
            description="Options for how the background in displayed"
            sl={backgroundMode}
          />

          <RadioGroup
            title="Opacity"
            ariaTitle="Background mode"
            description="Options for the opacity of the text in the background"
            sl={backgroundOpacity}
          />
        </div>

        <hr class="border-lighter -mx-4 border-t" />
        <p class="text-center">
          <span class="opacity-50">Version:</span>{" "}
          <a
            href="https://codeberg.org/satonomics/satonomics/src/branch/main/CHANGELOG.md"
            target="_blank"
          >
            {version}
          </a>
        </p>
      </div>
    </div>
  );
}

function RadioGroup<
  T extends
    | string
    | {
        text: string;
        value: number;
      },
>({
  title,
  sl,
  ariaTitle,
  description,
}: {
  title: string;
  ariaTitle: string;
  description: string;
  sl: SL<T>;
}) {
  return (
    <fieldset aria-label={`Choose an option for: ${ariaTitle}`}>
      <p class="pb-0.5">{title}</p>

      <p class="pb-1 text-sm opacity-50">{description}</p>

      <div class="border-superlight -mx-2 mt-2 flex gap-1.5 rounded-lg border bg-stone-400/30 p-1.5 backdrop-blur-[2px] dark:bg-stone-950/75">
        <For each={sl.list()}>
          {(value) => (
            <label
              class={classPropToString([
                value === sl.selected()
                  ? "border-lighter bg-orange-50/75 shadow dark:bg-orange-200/10"
                  : "border-transparent",
                "flex cursor-pointer select-none items-center justify-center rounded-md border px-3 py-1.5 font-medium hover:bg-orange-50 focus:outline-none active:scale-95 active:bg-orange-50 dark:hover:bg-orange-200/20 dark:active:bg-orange-200/10 sm:flex-1",
              ])}
            >
              <input
                type="radio"
                name={`${title}-option`}
                value={typeof value === "object" ? value.value : value}
                class="sr-only"
                onClick={() => {
                  sl.select(value);
                }}
              />
              <span>{typeof value === "object" ? value.text : value}</span>
            </label>
          )}
        </For>
      </div>
    </fieldset>
  );
}
