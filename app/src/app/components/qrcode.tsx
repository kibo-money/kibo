export function Qrcode({ qrcode }: { qrcode: RWS<string> }) {
  return (
    <Show when={qrcode()}>
      <div
        class="absolute inset-0 z-50 flex size-full justify-center bg-black"
        onClick={() => {
          qrcode.set("");
        }}
      >
        <div class="flex size-full max-w-md flex-col items-center justify-center bg-black px-8 py-16 text-lg">
          <p class="pb-16 text-2xl font-bold">Share</p>

          <div class="flex min-h-0 w-full flex-1 flex-col">
            <p>You can scan the following QR Code with a phone:</p>
            <img
              class="aspect-square min-h-0 flex-1 grow object-contain"
              src={qrcode()}
              style={{ "image-rendering": "pixelated" }}
            />
          </div>
          <div>
            <p>Or if you prefer you can send this link instead:</p>
            <a
              onClick={(event) => {
                event.stopPropagation();
              }}
              href={location.href}
            >
              {location.href}
            </a>
          </div>
        </div>
      </div>
    </Show>
  );
}
