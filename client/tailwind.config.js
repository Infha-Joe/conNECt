export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F6F4EE",
        surface: "#FFFFFF",
        primary: "#16857A",
        brand: "#16857A",
        "primary-hover": "#11665D",
        "primary-dark": "#173B3A", // Deep Teal
        "primary-light": "#DCEFEB", // Light Teal
        secondary: "#C86B4A", // Terracotta
        ink: "#172321", // Main Text
        "ink-light": "#66736F", // Muted Text
        border: "#DDE1DC",
        success: "#397A5B",
        danger: "#B84A4A",
        warning: "#F59E0B"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
