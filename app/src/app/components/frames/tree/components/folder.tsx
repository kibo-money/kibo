import { Line } from "../../line";

export function Folder({
  id,
  name,
  depth,
  open,
  onClick,
  children,
}: {
  id: string;
  name: string;
  depth: number;
  open: Accessor<boolean>;
  onClick: VoidFunction;
  children: number;
}) {
  const icon = createMemo(() =>
    open() ? <IconTablerFolderOpen /> : <IconTablerFolder />,
  );

  return (
    <Line
      id={id}
      depth={depth}
      name={name}
      icon={icon}
      onClick={onClick}
      classes={() => (open() ? "text-orange-100/75" : "")}
      tail={() => (
        <Show when={!open()}>
          <span class="rounded-full bg-white bg-opacity-[0.075] px-2 py-0.5 text-xs text-neutral-400">
            {children}
          </span>
        </Show>
      )}
    ></Line>
  );
}
