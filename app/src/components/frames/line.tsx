import { scrollIntoView } from "/src/scripts/utils/scroll";
import { classPropToString } from "/src/solid/classes";
import { createRWS } from "/src/solid/rws";

export function Line({
  id,
  name: _name,
  icon,
  active,
  depth = 0,
  onClick,
  header,
  tail,
  classes: classes,
}: {
  id: string;
  name: string;
  onClick: VoidFunction;
  active?: Accessor<boolean>;
  depth?: number;
  header?: string;
  icon?: () => JSXElement;
  tail?: () => JSXElement;
  classes?: () => string;
} & ParentProps) {
  const ref = createRWS<HTMLButtonElement | undefined>(undefined);

  const [name, ...nameRest] = _name.split(" - ");

  return (
    <button
      id={id}
      class={classPropToString([
        active?.() && "orange",
        "relative -mx-2 flex w-[calc(100%+1rem)] items-center whitespace-nowrap rounded-lg px-2 text-sm font-medium hover:text-[var(--orange)]",
        classes?.(),
      ])}
      ref={ref.set}
      onClick={() => {
        onClick();
        scrollIntoView(ref(), "nearest", "instant");
      }}
      title={name}
    >
      <For each={new Array(depth)}>
        {() => <span class="ml-1 h-8 w-3 flex-none border-l" />}
      </For>
      <Show when={icon}>
        {(icon) => (
          <span
            class="-my-0.5 mr-1"
            // style={{
            //   "margin-left": `${depth}rem`,
            // }}
          >
            {icon()()}
          </span>
        )}
      </Show>
      <span
        class={classPropToString([
          "inline-flex w-full flex-col -space-y-1 truncate py-1 text-left",
        ])}
      >
        <Show when={header}>
          <span class="off truncate text-xs" innerHTML={header} />
        </Show>
        <span class="space-x-1 truncate">
          <span innerHTML={name} />
          <Show when={nameRest.length}>
            <span innerHTML={" — " + nameRest.join(" — ")} class="off" />
          </Show>
        </span>
      </span>
      <Show when={tail}>
        {(absolute) => (
          <span class="ml-0.5 flex items-center">{absolute()()}</span>
        )}
      </Show>
    </button>
  );
}
