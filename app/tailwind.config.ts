import containerQueries from "@tailwindcss/container-queries";
import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./index.html"],
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lexend", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        md: "720px",
        "2xl": "1600px",
        short: { raw: "(max-height: 350px)" },
      },
    },
  },
  plugins: [containerQueries],
} satisfies Config;
