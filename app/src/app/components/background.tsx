import { phone, touchScreen } from "/src/env";
import { createRWS } from "/src/solid/rws";

const texts = [
  "satonomics",
  "satonomics",
  "satonomics",
  "satonomics",
  "satonomics",

  "stay humble, stack sats",
  "21 million",
  "cold storage",
  "utxo",
  "satoshi nakamoto",
  "hodl",
  `don't trust, verify`,
  "zap",
  "₿itcoin",
  "lightning",
  "nostr",
  "freedom tech",
  "2008/10/31",
  "2009/01/03",
  "2010/05/22",
  "hodl!",
  "Hal Finney",
  "Vote for better money",
  "gradually then suddenly",
  "timechain",
  "self custody",
  "be your own bank",
  "resistance money",
  "foss",
  "permissionless",
  "great reset",
  "orange pill",
  "borderless",
  "anonymous",
  "nyknyc",
  "low time preference",
  "absolute scarcity",
  "time is scarce",
  "ride or die",
  "cyberpunk",
];

export function Background({
  mode,
  opacity,
  focused,
}: {
  mode: SL<"Scroll" | "Static">;
  opacity: SL<{ text: string; value: number }>;
  focused: Accessor<boolean>;
}) {
  return (
    <>
      <div
        class="absolute h-full w-full overflow-hidden will-change-auto"
        style={{
          opacity: opacity.selected().value,
        }}
      >
        <div class="-m-[2rem] -space-y-1 overflow-hidden md:-m-[1rem]">
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
          <Line mode={mode} focused={focused} />
        </div>
      </div>
      <div class="absolute h-full w-full opacity-10 mix-blend-multiply">
        <Noise />
      </div>
      <div class="absolute h-full w-full opacity-10 mix-blend-hard-light">
        <Noise />
      </div>
    </>
  );
}

function Line({
  mode,
  focused,
}: {
  mode: SL<"Scroll" | "Static">;
  focused: Accessor<boolean>;
}) {
  const shuffled = shuffle(texts).slice(0, 10);
  const joined = shuffled.join(". ");

  return (
    <div class="select-none whitespace-nowrap">
      <TextWrapper mode={mode} focused={focused} joined={joined} />
    </div>
  );
}

function TextWrapper({
  joined,
  mode,
  focused,
}: {
  mode: SL<"Scroll" | "Static">;
  focused: Accessor<boolean>;
  joined: string;
}) {
  const p = createRWS(undefined as HTMLParagraphElement | undefined);

  const seconds = createRWS(joined.length * 2);

  const wasOnceOn = createRWS(false);

  createEffect(() => {
    if (!wasOnceOn() && mode.selected() === "Scroll") {
      wasOnceOn.set(true);
    }
  });

  // Bug in Safari iOS, not sure where else, works perfectly on Mac OS though
  if (!touchScreen) {
    onMount(() => {
      seconds.set(Math.round(p()!.clientWidth / 20));
    });
  }

  return (
    <p
      ref={p.set}
      class="inline-block px-2 text-[5dvh] font-black uppercase leading-none"
      style={{
        ...(wasOnceOn()
          ? {
              animation: `marquee ${seconds()}s linear infinite`,
              "animation-play-state":
                focused() && mode.selected() === "Scroll"
                  ? "running"
                  : "paused",
            }
          : {}),
      }}
    >
      {joined} {wasOnceOn() ? joined : undefined}
    </p>
  );
}

function shuffle<T>([...arr]: T[]): T[] {
  let m = arr.length;

  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }

  return arr;
}

function Noise() {
  return (
    <svg
      class="size-full"
      viewBox="0 0 200 200"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="3"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>

      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  );
}
