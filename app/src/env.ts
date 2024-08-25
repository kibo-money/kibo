export const standalone =
  "standalone" in window.navigator && !!window.navigator.standalone;

export const touchScreen =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  (navigator as any).msMaxTouchPoints > 0;

export const requestIdleCallbackPossible = "requestIdleCallback" in window;

console.log(navigator.userAgent);

export const macOS = navigator.userAgent.toLowerCase().includes("mac os");

export const iphone = navigator.userAgent.toLowerCase().includes("iphone");

export const ipad = navigator.userAgent.toLowerCase().includes("ipad");

export const chrome = navigator.userAgent.toLowerCase().includes("chrome");

export const firefox = navigator.userAgent.toLowerCase().includes("firefox");

export const gecko = navigator.userAgent.toLowerCase().includes("gecko");

export const safari = navigator.userAgent.toLowerCase().includes("safari");

export const safariOnly = safari && !chrome;

export const phone =
  /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
