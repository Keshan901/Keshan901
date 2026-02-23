import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#0b2545",
          teal: "#0ea5a4",
          light: "#e0f7f6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
