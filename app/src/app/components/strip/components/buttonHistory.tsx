import { Button } from "./button";

export function ButtonHistory({
  selected,
  setSelected,
}: {
  selected: Accessor<FrameName>;
  setSelected: Setter<FrameName>;
}) {
  const frameName: FrameName = "History";

  return (
    <Button
      title={frameName}
      selected={() => selected() === frameName}
      onClick={() => {
        setSelected(frameName);
      }}
      icon={() => IconTablerHistory}
    />
  );
}
