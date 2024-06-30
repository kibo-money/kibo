import { classPropToString } from "/src/solid/classes";

export function Clickable({
  selected,
  onClick,
  href,
  icon,
  children,
  title,
}: {
  title: string;
  selected?: Accessor<boolean>;
  onClick?: VoidFunction;
  href?: string;
  icon?: () => ValidComponent;
} & ParentProps) {
  return (
    <Dynamic
      component={onClick ? "button" : href ? "a" : "span"}
      class={classPropToString([
        !href
          ? selected?.()
            ? "bg-orange-800/10 dark:bg-orange-200/10"
            : "text-orange-900/50 dark:text-orange-100/50"
          : "text-opacity-70 dark:text-opacity-70",
        "select-none rounded-lg p-3.5 hover:bg-orange-800/10 hover:text-orange-600 hover:opacity-100 active:scale-90 dark:hover:bg-orange-200/10 dark:hover:text-orange-400",
      ])}
      title={title}
      onClick={onClick}
      href={href}
      target={
        href?.startsWith("/") || href?.startsWith("http") ? "_blank" : undefined
      }
    >
      <Show when={icon} fallback={children}>
        {(icon) => <Dynamic component={icon()()} class="size-5" />}
      </Show>
    </Dynamic>
  );
}
