import { classPropToString } from "/src/solid/classes";

export function Button({
  title,
  icon,
  colors,
  onClick,
  disabled,
  classes,
}: {
  title: string;
  icon: () => ValidComponent;
  colors?: () => string;
  onClick: VoidFunction;
  disabled?: () => boolean;
  classes?: string;
}) {
  return (
    <button
      title={title}
      disabled={disabled?.()}
      class={classPropToString([
        colors?.() || (disabled?.() ? "" : "hover:bg-orange-200/15"),
        !disabled?.() && "group",
        classes,
        "flex-none rounded-lg p-2 disabled:opacity-50",
      ])}
      onClick={onClick}
    >
      <Dynamic
        component={icon()}
        class="size-[1.125rem] group-active:scale-90"
      />
    </button>
  );
}
