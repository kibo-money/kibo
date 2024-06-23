export const scrollIntoView = (
  element?: HTMLElement | Element | null,
  block: ScrollLogicalPosition = "nearest",
  behavior: ScrollBehavior = "instant",
) =>
  element?.scrollIntoView({
    block,
    behavior,
  });
