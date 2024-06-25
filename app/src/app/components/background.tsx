import { createRWS } from "/src/solid/rws";

const texts = [
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
  "bitcoin",
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
];

export const LOCAL_STORAGE_MARQUEE_KEY = "bg-marquee";

export function Background({
  marquee: on,
  focused,
}: {
  marquee: Accessor<boolean>;
  focused: Accessor<boolean>;
}) {
  createEffect(() => {
    if (on()) {
      localStorage.removeItem(LOCAL_STORAGE_MARQUEE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_MARQUEE_KEY, "false");
    }
  });

  return (
    <>
      <div class="absolute h-full w-full overflow-hidden opacity-[0.0333] will-change-auto">
        <div class="-m-[2rem] -space-y-1 overflow-hidden md:-m-[1rem]">
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
          <Line on={on} focused={focused} />
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
  on,
  focused,
}: {
  on: Accessor<boolean>;
  focused: Accessor<boolean>;
}) {
  const shuffled = shuffle([...texts]);
  shuffled.pop();
  const joined = shuffled.join(". ");

  return (
    <div class="select-none whitespace-nowrap">
      <TextWrapper on={on} focused={focused} joined={joined} />
    </div>
  );
}

function TextWrapper({
  joined,
  on,
  focused,
}: {
  on: Accessor<boolean>;
  focused: Accessor<boolean>;
  joined: string;
}) {
  const seconds = joined.length * 2;

  const wasOnceOn = createRWS(false);

  createEffect(() => {
    if (!wasOnceOn() && on()) {
      wasOnceOn.set(true);
    }
  });

  return (
    <p
      class="inline-block px-2 text-[5dvh] font-black uppercase leading-none"
      style={{
        ...(wasOnceOn()
          ? {
              animation: `marquee ${seconds}s linear infinite`,
              "animation-play-state": focused() && on() ? "running" : "paused",
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
