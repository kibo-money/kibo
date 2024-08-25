import { Line } from "../../line";

export function File({
  id,
  name,
  icon,
  active,
  depth,
  onClick,
  favorite,
  visited,
}: {
  id: string;
  name: string;
  icon: JSXElement;
  active: Accessor<boolean>;
  depth: number;
  onClick: VoidFunction;
  favorite: Accessor<boolean>;
  visited: Accessor<boolean>;
}) {
  const tail = createMemo(() =>
    favorite() ? (
      // <span class="p-1">
      <IconTablerStarFilled class="orange size-3" />
    ) : // </span>
    !visited() ? (
      <span class="ml-1.5 rounded-full bg-orange-500 p-[3px] text-transparent" />
    ) : undefined,
  );

  return (
    <Line
      id={id}
      depth={depth}
      active={active}
      name={name}
      icon={() => icon}
      onClick={onClick}
      tail={tail}
    />
  );
}
