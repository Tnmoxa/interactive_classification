const { nextui } = require("@nextui-org/theme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html, js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              //... 50 to 900
              foreground: "#FFFFFF",
              DEFAULT: "#006FEE",
            },
          },
        },
        dark: {
          colors: {
            background: "#000000",
            foreground: "#ECEDEE",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#006FEE",
            },
          },
        },
        "blue-dark": {
          extend: "dark",
          colors: {
            background: "#00051a",
            foreground: "#ffffff",
            primary: {
              50: "#00051a",
              100: "#051049",
              200: "#0e1a7a",
              300: "#1624ac",
              400: "#1e2ede",
              500: "#2e48f6",
              600: "#5570f7",
              700: "#8498f8",
              800: "#b5c1fa",
              900: "#e5eaff",
              DEFAULT: "#2a1ff7",
              foreground: "#ffffff",
            },
            focus: "#0f39d7",
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
  ],
};

