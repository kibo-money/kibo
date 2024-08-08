import { classPropToString } from "/src/solid/classes";

export function Box({
  flex = true,
  absolute,
  padded = true,
  spaced = true,
  children,
  dark,
  classes,
}: {
  flex?: boolean;
  absolute?: "top" | "bottom";
  padded?: boolean;
  spaced?: boolean;
  dark?: boolean;
  classes?: string;
} & ParentProps) {
  return (
    <div
      class={classPropToString([
        "p-2",
        absolute
          ? [
              "absolute inset-x-0",
              absolute === "top"
                ? "top-0"
                : "pointer-events-none bottom-0 bg-gradient-to-b from-transparent to-orange-100 dark:to-black",
            ]
          : "relative",
        classes,
      ])}
    >
      <div
        class={classPropToString([
          "border-lighter pointer-events-auto relative overflow-hidden rounded-xl border shadow-md",
          dark
            ? "bg-white/40 backdrop-blur-sm dark:bg-orange-100/5"
            : "bg-white/60 backdrop-blur-md dark:bg-orange-200/10",
        ])}
      >
        <div
          class={classPropToString([
            flex && "flex w-full",
            spaced && "space-x-2",
            padded && "p-1.5",
          ])}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
