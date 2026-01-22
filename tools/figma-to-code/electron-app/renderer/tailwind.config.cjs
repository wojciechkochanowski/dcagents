/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          900: "#0f172a",
          800: "#111827",
          700: "#1f2937",
        },
      },
    },
  },
  plugins: [],
};
