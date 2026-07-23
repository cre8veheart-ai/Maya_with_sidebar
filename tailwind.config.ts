import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        maya: {
          sidebar: "#F5F5F7",
          border: "#E5E5EA",
          "text-primary": "#1D1D1F",
          "text-secondary": "#6E6E73",
          "text-tertiary": "#AEAEB2",
          accent: "#0066CC",
          "accent-bg": "#E5F0FF",
          hover: "#EBEBED",
          card: "#F9F9FB",
          ink: "#3D3D3D",
        },
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [],
};

export default config;
