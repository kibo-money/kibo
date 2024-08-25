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
      tail={() => (
        <Show when={!open()}>
          <span class="off rounded-full py-0.5 pl-2 text-xs">{children}</span>
        </Show>
      )}
    ></Line>
  );
}
