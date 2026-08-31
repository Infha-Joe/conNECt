/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0f172a", // Deep Navy / Charcoal
          light: "#1e293b",
        },
        brand: {
          DEFAULT: "#2563eb", // Modern Blue
          hover: "#1d4ed8",
        },
        parchment: "#f8fafc", // Very light cool gray / slate-50
        brass: {
          DEFAULT: "#C9A24B", // Small NEC gold accent
          dark: "#A9843A",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
