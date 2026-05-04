/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocdeBlue: "#1B4F72",
        ocdeGreen: "#145A32",
        ocdeAmber: "#fbbf24",
        ocdeRed: "#ef4444",
      },
      boxShadow: {
        panel: "0 18px 45px rgba(15, 23, 42, 0.12)",
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
        mono: ["Consolas", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
