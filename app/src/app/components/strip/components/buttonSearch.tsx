import { Button } from "./button";

export function ButtonSearch({
  selected,
  setSelected,
}: {
  selected: Accessor<FrameName>;
  setSelected: Setter<FrameName>;
}) {
  const frameName: FrameName = "Search";

  return (
    <Button
      title={frameName}
      selected={() => selected() === frameName}
      onClick={() => {
        setSelected(frameName);
      }}
      icon={() =>
        selected() === frameName ? IconTablerZoomFilled : IconTablerSearch
      }
    />
  );
}
