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
        absolute
          ? [
              "absolute inset-x-0",
              absolute === "top" ? "top-0" : "pointer-events-none bottom-0",
            ]
          : "relative",
        classes,
      ])}
    >
      <div
        class={classPropToString([
          "pointer-events-auto relative overflow-hidden rounded-full border shadow-md",
        ])}
        style={{
          "background-color": "var(--background-color)",
        }}
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
