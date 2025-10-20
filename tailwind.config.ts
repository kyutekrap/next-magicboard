import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#171717",
        primary: "#2196f3",
        primaryDark: "#1976d2",
        primaryLight: 'rgba(29, 155, 240, 0.2)',
        neutral: "#eeeeee",
        neutralDark: "#e6e6e6",
        neutralLight: "#f2f2f2",
        error: "#D20103",
        success: "#22C55E",
        hoverTint: "#eeeeee",
        hoverTintDark: "rgba(255, 255, 255, 0.2)",
        darkGray: "rgb(107 114 128)"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      boxShadow: {
        'custom': '0 1px 3px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
};
export default config;