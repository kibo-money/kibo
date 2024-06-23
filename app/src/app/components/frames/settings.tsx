import { Header } from "./header";

export function SettingsFrame({
  marquee,
  selectedFrame,
}: {
  marquee: RWS<boolean>;
  selectedFrame: Accessor<FrameName>;
}) {
  const value = marquee();

  return (
    <div class="flex-1 overflow-y-auto" hidden={selectedFrame() !== "Settings"}>
      <div class="space-y-4 p-4">
        <Header title="Settings" />

        <div class="-mx-4 border-t border-orange-200/10" />

        <div class="space-y-2">
          <p>Background</p>
          <div>Opacity</div>
          <div>
            <label class="switch">
              Scroll
              <input
                type="checkbox"
                checked={value}
                onChange={(event) => marquee.set(event.target.checked || false)}
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
