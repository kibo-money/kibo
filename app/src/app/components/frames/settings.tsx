import { version } from "/src/../package.json";
import { ipad, iphone, macOS, safariOnly, standalone } from "/src/env";
import { classPropToString } from "/src/solid/classes";

import { AnchorAPI } from "../strip/components/anchorAPI";
import { AnchorGeyser } from "../strip/components/anchorGeyser";
import { AnchorGit } from "../strip/components/anchorGit";
import { AnchorNostr } from "../strip/components/anchorNostr";
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
      class="flex-1 overflow-y-auto overflow-x-hidden"
      style={{
        display: selectedFrame() !== "Settings" ? "none" : undefined,
      }}
    >
      <div class="space-y-4 p-4">
        <Header title="Settings">And other stuff</Header>

        <div class="border-lighter -mx-4 border-t" />

        <div class="space-y-4">
          <Title>General</Title>

          <RadioGroup
            title="Theme"
            ariaTitle="App's theme"
            description="Options for the app's theme"
            sl={appTheme}
          />
        </div>

        <div class="border-lighter -mx-4 border-t" />

        <div class="space-y-4">
          <Title>Background</Title>

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

        <div class="space-y-4">
          <Title>Donations</Title>

          <p>
            A <strong>massive thank you</strong> to everybody who sent their
            hard earned sats. This project, by being completely free, is very
            dependent and only founded by the goodwill of fellow ₿itcoiners.
          </p>
          <p>Top 10 Leaderboard:</p>
          <ol class="list-inside list-decimal">
            <For
              each={[
                {
                  name: "_Checkɱate",
                  url: "https://primal.net/p/npub1qh5sal68c8swet6ut0w5evjmj6vnw29x3k967h7atn45unzjyeyq6ceh9r",
                  amount: 500_000,
                },
                {
                  name: "avvi |",
                  url: "https://primal.net/p/npub1md2q6fexrtmd5hx9gw2p5640vg662sjlpxyz3tdmu4j4g8hhkm6scn6hx3",
                  amount: 5_000,
                },
                {
                  name: "mutatrum",
                  url: "https://primal.net/p/npub1hklphk7fkfdgmzwclkhshcdqmnvr0wkfdy04j7yjjqa9lhvxuflsa23u2k",
                  amount: 5_000,
                },
                {
                  name: "Gunnar",
                  url: "https://primal.net/p/npub1rx9wg2d5lhah45xst3580sajcld44m0ll9u5dqhu2t74p6xwufaqwghtd4",
                  amount: 1_000,
                },
                {
                  name: "Blokchain Boog",
                  url: "https://x.com/BlokchainB",
                  amount: 1_500 + 1590,
                },
                {
                  name: "Josh",
                  url: "https://primal.net/p/npub1pc57ls4rad5kvsp733suhzl2d4u9y7h4upt952a2pucnalc59teq33dmza",
                  amount: 1_000,
                },
                {
                  name: "Alp",
                  url: "https://primal.net/p/npub175nul9cvufswwsnpy99lvyhg7ad9nkccxhkhusznxfkr7e0zxthql9g6w0",
                  amount: 1_000,
                },
                {
                  name: "Ulysses",
                  url: "https://primal.net/p/npub1n7n3dssm90hfsfjtamwh2grpzwjlvd2yffae9pqgg99583lxdypsnn9gtv",
                  amount: 1_000,
                },
                {
                  name: "btcschellingpt",
                  url: "https://primal.net/p/npub1nvfgglea9zlcs58tcqlc6j26rt50ngkgdk7699wfq4txrx37aqcsz4e7zd",
                  amount: 1_000 + 1_000,
                },
                {
                  name: "Coinatra",
                  url: "https://primal.net/p/npub1eut9kcejweegwp9waq3a4g03pvprdzkzvjjvl8fvj2a2wlx030eswzfna8",
                  amount: 1_000,
                },
                {
                  name: "Printer Go Brrrr",
                  url: "https://primal.net/p/npub1l5pxvjzhw77h86tu0sml2gxg8jpwxch7fsj6d05n7vuqpq75v34syk4q0n",
                  amount: 1_000,
                },
                {
                  name: "b81776c32d7b",
                  url: "https://primal.net/p/npub1hqthdsed0wpg57sqsc5mtyqxxgrh3s7493ja5h49v23v2nhhds4qk4w0kz",
                  amount: 17_509,
                },
                {
                  name: "DerGigi",
                  url: "https://primal.net/p/npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc",
                  amount: 6001,
                },
                {
                  name: "Adarnit",
                  url: "https://primal.net/p/npub17armdveqy42uhuuuwjc5m2dgjkz7t7epgvwpuccqw8jusm8m0g4sn86n3s",
                  amount: 17_726,
                },
                {
                  name: "Auburn Citadel",
                  url: "https://primal.net/p/npub1730y5k2s9u82w9snx3hl37r8gpsrmqetc2y3xyx9h65yfpf28rtq0y635y",
                  amount: 17_471,
                },
                {
                  name: "Anon",
                  amount: 210_000,
                },
                {
                  name: "Daniel ∞/21M",
                  url: "https://twitter.com/DanielAngelovBG",
                  amount: 21_000,
                },
              ]
                .sort((a, b) =>
                  b.amount !== a.amount
                    ? b.amount - a.amount
                    : a.name.localeCompare(b.name),
                )
                .slice(0, 10)}
            >
              {({ name, url, amount }) => (
                <li>
                  <a href={url} target="_blank">
                    {name}
                  </a>{" "}
                  - {amount.toLocaleString("en-us")} sats
                </li>
              )}
            </For>
          </ol>
        </div>

        <Show when={!standalone && safariOnly && (macOS || ipad || iphone)}>
          <hr class="border-lighter -mx-4 border-t" />

          <div class="space-y-4">
            <Title>Install</Title>
            <p>
              <Show when={macOS}>
                This app can be installed by clicking on the "File" tab on the
                menu bar and then on "Add to dock".
              </Show>
              <Show when={iphone || ipad}>
                This app can be installed by tapping on the "Share" button tab
                of Safari and then on "Add to Home Screen".
              </Show>
            </p>
          </div>
        </Show>
      </div>

      <hr class="border-lighter -mx-4 border-t" />

      <div class="pt-4 md:hidden">
        <div class="flex items-center justify-center gap-8 py-1">
          <AnchorAPI />
          <AnchorGit />
          <AnchorNostr />
          <AnchorGeyser />
        </div>
      </div>

      <p class="pb-[10vh] pt-4 text-center">
        <span class="opacity-50">Version:</span>{" "}
        <a
          href="https://github.com/satonomics-org/satonomics/blob/main/CHANGELOG.md"
          target="_blank"
        >
          {version}
        </a>
      </p>
    </div>
  );
}

function Title({ children }: ParentProps) {
  return <p class="text-base font-medium">{children}</p>;
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
                "flex flex-1 cursor-pointer select-none items-center justify-center rounded-md border px-3 py-1.5 font-medium hover:bg-orange-50 focus:outline-none active:scale-95 active:bg-orange-50 dark:hover:bg-orange-200/20 dark:active:bg-orange-200/10",
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
