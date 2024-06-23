export function replaceHistory({
  urlParams,
  pathname,
}: {
  urlParams?: URLSearchParams;
  pathname?: string;
}) {
  urlParams ||= new URLSearchParams(window.location.search);
  pathname ||= window.location.pathname;

  window.history.replaceState(null, "", `${pathname}?${urlParams.toString()}`);
}
