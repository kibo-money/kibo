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
      class="inline-flex select-none p-4 active:scale-90"
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
