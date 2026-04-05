import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      xs: "0.7rem",
      sm: "0.8rem",
    },
    extend: {
      colors: {
        // Backgrounds
        greenBackgroundTransparent: "rgba(0,194,120,.12)",
        redBackgroundTransparent: "rgba(234,56,59,.12)",
        baseBackgroundL2: "rgb(32,33,39)",
        baseBackgroundL3: "rgb(32,33,39)",
        // Buttons
        greenPrimaryButtonBackground: "rgb(0,194,120)",
        greenPrimaryButtonText: "rgb(20,21,27)",
        // Borders
        redBorder: "rgba(234,56,59,.5)",
        greenBorder: "rgba(0,194,120,.4)",
        baseBorderMed: "#2b3139",
        baseBorderLight: "rgb(32,33,39)",
        baseBorderFocus: "#4a4f5a",
        accentBlue: "rgb(76,148,255)",
        // Text
        baseTextHighEmphasis: "rgb(244,244,246)",
        baseTextMedEmphasis: "#848e9c",
        greenText: "rgb(0,194,120)",
        redText: "rgb(234,56,59)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;