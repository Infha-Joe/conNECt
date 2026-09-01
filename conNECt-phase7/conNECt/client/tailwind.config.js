/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0F1B33", light: "#1C2D4F" },
        parchment: "#F7F5F0",
        brass: { DEFAULT: "#C9A24B", dark: "#A9843A" },
        sage: "#6B8F71",
        slate: { text: "#5B6472" },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
