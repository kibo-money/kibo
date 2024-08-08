import { Button } from "./button";

export function ButtonChart({
  selected,
  setSelected,
}: {
  selected: Accessor<FrameName>;
  setSelected: Setter<FrameName>;
}) {
  const frameName: FrameName = "Chart";

  return (
    <Button
      title={frameName}
      selected={() => selected() === frameName}
      onClick={() => {
        setSelected(frameName);
      }}
      icon={() =>
        selected() === frameName
          ? IconTablerChartAreaFilled
          : IconTablerChartLine
      }
      hideOnDesktop
    />
  );
}
