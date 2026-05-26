/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#060811",
        panel: "#0b1020",
        cyan: "#18d4ff",
        electric: "#2264ff"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(24,212,255,.35), 0 0 32px rgba(34,100,255,.25)"
      },
      backgroundImage: {
        radial: "radial-gradient(circle at top right, rgba(34,100,255,.2), transparent 40%)"
      }
    }
  },
  plugins: []
};
