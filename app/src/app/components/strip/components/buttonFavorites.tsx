import { Button } from "./button";

export function ButtonFavorites({
  selected,
  setSelected,
}: {
  selected: Accessor<FrameName>;
  setSelected: Setter<FrameName>;
}) {
  const frameName: FrameName = "Favorites";

  return (
    <Button
      title={frameName}
      selected={() => selected() === frameName}
      onClick={() => {
        setSelected(frameName);
      }}
      icon={() =>
        selected() === frameName ? IconTablerStarFilled : IconTablerStar
      }
    />
  );
}
