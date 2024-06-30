import { touchScreen } from "/src/env";

export function Qrcode({ qrcode }: { qrcode: RWS<string> }) {
  return (
    <Show when={qrcode()}>
      <div
        class="absolute inset-0 z-50 flex size-full items-center justify-center bg-black/50 backdrop-blur-md"
        onClick={() => {
          qrcode.set("");
        }}
      >
        <div class="flex size-full max-h-[80dvh] max-w-md flex-col justify-center space-y-8 px-8 pb-8 text-base">
          <p class="pb-4 text-center text-3xl font-bold">Share</p>

          <p>
            To share this page, you can either send the following QR Code with a
            phone:
          </p>
          <div class="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
            <img
              class="aspect-square min-h-0 flex-1 grow object-contain"
              onClick={(event) => {
                event?.stopPropagation();
              }}
              src={qrcode()}
              style={{ "image-rendering": "pixelated" }}
            />
          </div>

          <div>
            <p>Or if you prefer you can share this link instead:</p>
            <a
              onClick={(event) => {
                event.stopPropagation();
              }}
              href={location.href}
            >
              {location.href}
            </a>
          </div>

          <p>
            {touchScreen ? "Touch" : "Click"} anywhere but on the QR Code to
            exit.
          </p>
        </div>
      </div>
    </Show>
  );
}
