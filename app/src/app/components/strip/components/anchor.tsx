import { Clickable } from "./clickable";

export function Anchor(args: {
  title: string;
  href: string;
  icon?: () => ValidComponent;
}) {
  return <Clickable {...args} />;
}
