import { createSL } from "/src/scripts/utils/selectableList/static";
import { createPreferredColorSchemeAccessor } from "/src/solid/prefferedColorScheme";

export function createUserConfig({ dark }: { dark: RWS<boolean> }) {
  const userConfig = {
    settings: {
      appTheme: createSL(["System", "Dark", "Light"] as const, {
        saveable: {
          key: "app-theme",
          mode: "localStorage",
        },
        defaultIndex: 1,
      }),
      background: {
        mode: createSL(["Scroll", "Static"] as const, {
          saveable: {
            key: "bg-mode",
            mode: "localStorage",
          },
          defaultIndex: 0,
        }),
        opacity: createSL(
          [
            {
              text: "Strong",
              value: 0.035,
            },
            {
              text: "Normal",
              value: 0.03,
            },
            {
              text: "Light",
              value: 0.025,
            },
            {
              text: "Subtle",
              value: 0.02,
            },
          ] as const,
          {
            saveable: {
              key: "bg-text-opacity",
              mode: "localStorage",
            },
            defaultIndex: 2,
          },
        ),
      },
    },
  };

  const preferredSystemTheme = createPreferredColorSchemeAccessor();

  createEffect(() => {
    if (
      userConfig.settings.appTheme.selected() === "Dark" ||
      (userConfig.settings.appTheme.selected() === "System" &&
        preferredSystemTheme() === "dark")
    ) {
      dark.set(true);
      document.documentElement.classList.add("dark");
    } else {
      dark.set(false);
      document.documentElement.classList.remove("dark");
    }
  });

  return userConfig;
}
