export function Qrcode({ qrcode }: { qrcode: RWS<string> }) {
  return (
    <Show when={qrcode()}>
      <div
        class="absolute inset-0 z-50 flex h-full w-full  items-center justify-center bg-black"
        onClick={() => {
          qrcode.set("");
        }}
      >
        <img
          class="aspect-square max-h-full grow object-contain"
          src={qrcode()}
          style={{ "image-rendering": "pixelated" }}
        />
      </div>
    </Show>
  );
}
