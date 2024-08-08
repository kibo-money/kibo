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
      <span class="rounded-full bg-yellow-950 p-1">
        <IconTablerStarFilled class="size-3 text-amber-500" />
      </span>
    ) : !visited() ? (
      <span class="mx-1.5 rounded-full bg-orange-500/50 p-1 text-transparent" />
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

function randomDegree(min = 0, max = 360) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
