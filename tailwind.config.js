/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#5800C7",
        panel: "#1a1a1a",
        base: "#0b0b0b"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        xl: "14px",
      }
    },
  },
  plugins: [],
}
