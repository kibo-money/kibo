import { generate } from "lean-qr";

import { Button } from "./button";

export function ButtonShare({ qrcode }: { qrcode: RWS<string> }) {
  return (
    <Button
      title="Share"
      icon={() => IconTablerShare}
      onClick={() => {
        qrcode.set(() =>
          generate(document.location.href).toDataURL({
            on: [0xff, 0xff, 0xff, 0xff],
            off: [0x00, 0x00, 0x00, 0x00],
            padX: 0,
            padY: 0,
          }),
        );
      }}
    />
  );
}
