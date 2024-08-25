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
      class="frame"
      style={{
        display: selectedFrame() !== "Settings" ? "none" : undefined,
      }}
    >
      {/* <div class=""> */}
      <Header title="Settings">And other stuff</Header>

      <div class="border-lighter border-t" />

      <div class="space-y-4">
        <Title>General</Title>

        <FieldRadioGroup
          title="Theme"
          ariaTitle="App's theme"
          description="Options for the app's theme"
          sl={appTheme}
        />
      </div>

      <hr class="border-lighter border-t" />

      <div class="space-y-4">
        <Title>Donations</Title>

        <p>
          A massive thank you to everybody who sent their hard earned sats. This
          project, by being completely free, is very dependent and only founded
          by the goodwill of fellow ₿itcoiners.
        </p>
        <p>Top 21 Leaderboard:</p>
        <ol class="off ml-8 list-decimal">
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
                name: "anon",
                amount: 210_000,
              },
              {
                name: "Daniel ∞/21M",
                url: "https://twitter.com/DanielAngelovBG",
                amount: 21_000,
              },
              {
                name: "Ivo",
                url: "https://primal.net/p/npub1mnwjn40hr042rsmzu64rsnwsw07uegg4tjkv620c94p6e797wkvq3qeujc",
                amount: 5_000,
              },
              {
                name: "lassdas",
                url: "https://primal.net/p/npub1gmhctt2hmjqz8ay2x8h5f8fl3h4fpfcezwqneal3usu3u65qca4s8094ea",
                amount: 210_000,
              },
              {
                name: "anon",
                amount: 21_000,
              },
              {
                name: "xplbzx",
                url: "https://primal.net/p/npub1e0f808a350rxrhppu4zylzljt3arfpvrrpqdg6ft78xy6u49kq5slf0g92",
                amount: 10_110,
              },
              {
                name: "SoundMoney=Prosperity4ALL",
                url: "https://x.com/SoundmoneyP",
                amount: 420_000,
              },
            ]
              .sort((a, b) =>
                b.amount !== a.amount
                  ? b.amount - a.amount
                  : a.name.localeCompare(b.name),
              )
              .slice(0, 21)}
          >
            {({ name, url, amount }) => (
              <li class="text-sm">
                <a href={url} target="_blank" class="text-base">
                  {name}
                </a>{" "}
                —{" "}
                <span class="orange text-sm">
                  {amount.toLocaleString("en-us")} sats
                </span>
              </li>
            )}
          </For>
        </ol>
      </div>

      <Show when={!standalone && safariOnly && (macOS || ipad || iphone)}>
        <hr class="border-lighter border-t" />

        <div class="space-y-4">
          <Title>Install</Title>
          <p>
            <Show when={macOS}>
              This app can be installed by clicking on the "File" tab on the
              menu bar and then on "Add to dock".
            </Show>
            <Show when={iphone || ipad}>
              This app can be installed by tapping on the "Share" button tab of
              Safari and then on "Add to Home Screen".
            </Show>
          </p>
        </div>
      </Show>
      {/* </div> */}

      <hr class="border-lighter border-t" />

      <div class="pt-4 md:hidden">
        <div class="flex items-center justify-center gap-8 py-1">
          <AnchorAPI />
          <AnchorGit />
          <AnchorNostr />
          <AnchorGeyser />
        </div>
      </div>

      <p class="off p-4 text-center">
        <span>Charts are displayed via </span>{" "}
        <a href="https://www.tradingview.com" target="_blank">
          Trading View
        </a>
        <span>'s</span>{" "}
        <a
          href="https://www.tradingview.com/lightweight-charts/"
          target="_blank"
        >
          Lightweight Charts™
        </a>{" "}
        <span>library</span>
      </p>

      <hr class="border-t" />

      <footer class="pt-4">
        <p class="flex justify-center">
          <svg
            class="w-28"
            viewBox="0 0 750 180"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="matrix(7.5, 0, 0, 7.5, -2046.71228, -1592.744873)">
              <ellipse
                style="fill: #f97316;"
                cx="284.895"
                cy="224.366"
                rx="12"
                ry="12"
              />
              <path
                d="M 285.769 221.936 L 285.769 221.168 C 284.999 220.175 284.482 219 284.292 217.745 C 284.234 217.375 283.772 217.231 283.532 217.518 C 282.954 218.199 282.5 218.998 282.194 219.883 C 283.129 220.931 284.381 221.65 285.769 221.936 Z M 288.832 219.115 C 287.624 219.115 286.646 220.097 286.646 221.305 L 286.646 222.929 C 283.79 222.76 281.369 221.002 280.274 218.508 C 280.124 218.166 279.641 218.146 279.48 218.483 C 279.026 219.443 278.771 220.515 278.771 221.646 C 278.771 223.583 279.703 225.391 281.098 226.73 C 281.457 227.077 281.81 227.364 282.161 227.627 L 278.226 228.611 C 277.933 228.684 277.802 229.024 277.967 229.278 C 278.442 230.014 279.618 231.261 282.156 231.365 C 282.375 231.373 282.593 231.294 282.759 231.149 L 284.543 229.615 L 286.646 229.615 C 289.062 229.615 291.02 227.659 291.02 225.242 L 291.02 220.865 L 291.895 219.115 L 288.832 219.115 Z M 288.832 221.757 C 288.592 221.757 288.353 221.541 288.353 221.301 C 288.353 221.061 288.592 220.849 288.832 220.849 C 289.072 220.849 289.294 221.069 289.294 221.309 C 289.294 221.549 289.072 221.757 288.832 221.757 Z"
                style="fill: rgb(255, 255, 255);"
              />
              <path
                d="M 290.285 219.064 C 290.545 218.803 290.363 218.355 289.994 218.355 L 288.365 218.355 C 287.925 218.355 287.503 218.528 287.191 218.84 L 285.678 220.352 C 285.388 220.233 285.085 220.145 284.774 220.088 C 283.348 219.827 281.823 220.246 280.72 221.349 C 279.828 222.239 279.385 223.404 279.385 224.574 C 279.385 225.946 278.269 227.061 276.897 227.061 C 276.86 227.961 277.374 228.794 278.2 229.159 C 279.024 229.529 279.985 229.35 280.628 228.719 L 281.993 227.355 L 284.41 229.773 C 284.795 230.158 285.33 230.378 285.877 230.378 L 291.652 230.378 C 291.988 230.378 292.287 230.18 292.415 229.868 C 292.544 229.557 292.474 229.2 292.237 228.96 L 291.773 228.495 C 291.702 228.425 291.628 228.363 291.549 228.305 L 292.482 228.305 C 292.851 228.305 293.034 227.857 292.772 227.596 L 292.308 227.132 C 291.997 226.821 291.573 226.647 291.135 226.647 L 288.091 226.647 L 290.164 225.818 L 289.82 225.473 C 289.509 225.162 289.087 224.988 288.646 224.988 L 286.432 224.988 L 287.677 224.159 L 287.333 223.815 C 287.022 223.503 286.598 223.329 286.16 223.329 L 286.018 223.329 L 290.285 219.064 Z M 279.798 227.89 C 279.798 228.119 279.613 228.305 279.385 228.305 C 279.157 228.305 278.971 228.119 278.971 227.89 C 278.971 227.662 279.157 227.477 279.385 227.477 C 279.613 227.477 279.798 227.662 279.798 227.89 Z M 286.706 228.305 L 289.89 228.305 C 290.223 228.305 290.538 228.438 290.769 228.67 L 291.648 229.549 L 285.873 229.549 C 285.546 229.549 285.231 229.417 284.998 229.183 L 282.581 226.767 L 283.531 225.818 L 285.533 227.82 C 285.844 228.132 286.267 228.305 286.706 228.305 Z"
                style="fill: rgb(255, 255, 255); visibility: hidden; transform-box: fill-box; transform-origin: 50% 50%;"
                transform="matrix(-1, 0, 0, -1, 0.000002, 0.000002)"
              />
            </g>
            <g>
              <path
                d="M 278.049 146.789 L 278.049 127.527 L 287.141 117.972 L 304.4 146.789 L 331.83 146.789 L 303.784 100.251 L 332.755 69.739 L 303.013 69.739 L 278.049 97.477 L 278.049 30.598 L 254.318 30.598 L 254.318 146.789 L 278.049 146.789 Z M 354.169 57.719 C 361.565 57.719 367.575 51.709 367.575 44.158 C 367.575 36.608 361.565 30.752 354.169 30.752 C 346.618 30.752 340.608 36.608 340.608 44.158 C 340.608 51.709 346.618 57.719 354.169 57.719 Z M 342.457 146.789 L 366.188 146.789 L 366.188 69.739 L 342.457 69.739 L 342.457 146.789 Z M 406.407 146.789 L 407.64 136.927 C 411.801 144.015 421.047 148.792 431.834 148.792 C 453.716 148.792 468.972 132.92 468.972 109.035 C 468.972 83.916 455.257 67.119 433.683 67.119 C 422.588 67.119 412.417 71.742 407.794 78.677 L 407.794 30.598 L 384.063 30.598 L 384.063 146.789 L 406.407 146.789 Z M 407.948 107.802 C 407.948 96.244 415.653 88.539 426.749 88.539 C 437.998 88.539 445.087 96.398 445.087 107.802 C 445.087 119.205 437.998 127.064 426.749 127.064 C 415.653 127.064 407.948 119.359 407.948 107.802 Z M 498.713 56.332 L 543.402 56.332 L 543.402 40.306 L 498.713 40.306 L 498.713 56.332 Z M 478.526 108.11 C 478.526 132.458 496.402 148.638 521.058 148.638 C 545.56 148.638 563.435 132.458 563.435 108.11 C 563.435 83.762 545.56 67.428 521.058 67.428 C 496.402 67.428 478.526 83.762 478.526 108.11 Z M 502.412 107.956 C 502.412 96.398 509.963 88.693 521.058 88.693 C 531.999 88.693 539.55 96.398 539.55 107.956 C 539.55 119.667 531.999 127.372 521.058 127.372 C 509.963 127.372 502.412 119.667 502.412 107.956 Z"
                style="fill: var(--color);"
              />
              <path
                d="M 589.19 97.802 L 589.19 106.23 L 610.948 106.23 C 605.1 112.938 597.446 119.044 587.986 124.376 L 593.404 131.514 C 597.532 128.934 601.488 126.268 605.186 123.43 L 605.186 146.048 L 614.13 146.048 L 614.13 123.43 L 626.944 123.43 L 626.944 149.402 L 635.974 149.402 L 635.974 123.43 L 649.82 123.43 L 649.82 134.008 C 649.82 136.072 649.046 137.104 647.498 137.104 L 640.36 136.674 L 642.768 145.188 L 650.422 145.188 C 655.926 145.188 658.678 142.092 658.678 135.986 L 658.678 115.174 L 635.974 115.174 L 635.974 108.638 L 626.944 108.638 L 626.944 115.174 L 614.388 115.174 C 617.054 112.336 619.548 109.326 621.784 106.23 L 665.128 106.23 L 665.128 97.802 L 626.858 97.802 C 627.89 95.824 628.836 93.76 629.696 91.61 L 620.838 90.492 C 619.806 92.9 618.516 95.394 617.14 97.802 L 589.19 97.802 Z M 648.1 68.734 C 642.338 72.088 636.232 75.098 629.868 77.678 C 621.612 75.012 612.926 72.518 603.896 70.282 L 599.252 77.248 C 605.272 78.624 611.206 80.258 617.226 82.15 C 610.088 84.386 602.606 86.106 594.78 87.482 L 599.596 95.308 C 612.324 92.04 622.472 89.116 630.04 86.364 C 638.124 89.116 646.122 92.298 654.034 95.824 L 658.936 88.428 C 653.26 86.02 647.412 83.698 641.392 81.548 C 646.208 79.226 651.11 76.56 655.926 73.55 L 648.1 68.734 Z M 675.438 77.85 L 675.438 85.848 L 682.404 85.848 L 682.404 98.92 C 682.404 101.5 681.114 103.22 678.62 104.166 L 680.684 110.874 C 692.036 108.896 701.926 106.66 710.182 104.08 L 708.634 96.426 C 703.474 98.146 697.454 99.608 690.574 100.984 L 690.574 85.848 L 712.332 85.848 L 712.332 77.85 L 698.916 77.85 C 698.4 74.668 697.884 71.744 697.368 69.164 L 688.338 70.712 C 688.94 72.862 689.542 75.27 690.144 77.85 L 675.438 77.85 Z M 724.028 89.632 L 739.25 89.632 L 739.25 93.502 L 723.856 93.502 C 723.942 92.47 724.028 91.352 724.028 90.32 L 724.028 89.632 Z M 739.25 83.096 L 724.028 83.096 L 724.028 79.226 L 739.25 79.226 L 739.25 83.096 Z M 722.652 100.038 L 739.25 100.038 L 739.25 100.898 C 739.25 103.048 738.218 104.166 736.24 104.166 C 733.918 104.166 731.424 103.994 728.758 103.822 L 730.822 111.562 L 738.734 111.562 C 744.582 111.562 747.506 108.982 747.506 103.908 L 747.506 72.002 L 715.6 72.002 L 715.6 90.922 C 715.428 97.286 713.192 102.532 708.892 106.746 L 715.342 112.594 C 718.782 109.068 721.276 104.854 722.652 100.038 Z M 708.462 121.452 L 708.462 126.784 L 683.608 126.784 L 683.608 134.352 L 708.462 134.352 L 708.462 139.598 L 675.524 139.598 L 675.524 147.51 L 750 147.51 L 750 139.598 L 717.062 139.598 L 717.062 134.352 L 742.174 134.352 L 742.174 126.784 L 717.062 126.784 L 717.062 121.452 L 746.216 121.452 L 746.216 113.712 L 679.308 113.712 L 679.308 121.452 L 708.462 121.452 Z"
                style="fill: var(--off-color)"
              />
            </g>
          </svg>
        </p>
        <p class="off pt-3 text-center text-xs uppercase">
          formerly <b> satonomics</b>
        </p>
        <p class="off pb-[21vh] pt-6 text-center">
          <span>Version:</span>{" "}
          <a
            href="https://github.com/satonomics-org/satonomics/blob/main/CHANGELOG.md"
            target="_blank"
          >
            {version}
          </a>
        </p>
      </footer>
    </div>
  );
}

function Title({ children }: ParentProps) {
  return <p class="text-base font-medium">{children}</p>;
}

export function FieldRadioGroup<
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

      <RadioGroup sl={sl} title={title} />
    </fieldset>
  );
}

export function RadioGroup<
  T extends
    | string
    | {
        text: string;
        value: number;
      },
>({ title, sl, size }: { title: string; sl: SL<T>; size?: Size }) {
  return (
    <div
      class={classPropToString([
        size === "xs" && "space-x-2 text-xs",
        size === "sm" && "space-x-4 text-sm",
        (!size || size === "base") && "space-x-6 text-sm",
        "pointer-events-auto flex cursor-default",
      ])}
    >
      <For each={sl.list()}>
        {(value) => (
          <label
            class={classPropToString([
              size === "xs" && "rounded",
              size === "sm" && "rounded",
              (!size || size === "base") && "rounded-md",
              "flex flex-1 cursor-pointer select-none items-center justify-center font-medium focus:outline-none active:scale-95",
            ])}
            style={{
              color:
                value === sl.selected() ? "var(--color)" : "var(--off-color)",
            }}
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
  );
}
