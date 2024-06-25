export const standalone =
  "standalone" in window.navigator && !!window.navigator.standalone;

export const touchScreen =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  (navigator as any).msMaxTouchPoints > 0;
