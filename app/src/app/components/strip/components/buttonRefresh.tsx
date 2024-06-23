import { Button } from "./button";

export function ButtonRefresh() {
  return (
    <Button title="Refresh" onClick={() => document.location.reload()}>
      <IconTablerRefreshAlert class="absolute size-5 animate-ping text-orange-400" />
      <IconTablerRefreshAlert class="relative size-5 text-orange-300" />
    </Button>
  );
}
