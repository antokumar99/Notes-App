/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: [
          '"Clash Display"',
          '"Cabinet Grotesk"',
          "system-ui",
          "sans-serif",
        ],
        body: ['"Satoshi"', '"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        ink: {
          50: "#f4f3ff",
          100: "#ebe8ff",
          200: "#d9d4ff",
          300: "#bdb4fe",
          400: "#9c8bf9",
          500: "#7c5df4",
          600: "#6739e8",
          700: "#5629d4",
          800: "#4822af",
          900: "#3c1e8f",
          950: "#240e65",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.35s ease both",
        "fade-in": "fadeIn 0.2s ease both",
        "slide-up": "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        shimmer: "shimmer 1.6s infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: "translateY(20px) scale(0.97)" },
          to: { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        shimmer: { to: { backgroundPosition: "-200% 0" } },
        pulseDot: {
          "0%,100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.3)", opacity: 0.6 },
        },
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        "glow-ink": "0 0 30px rgba(124,93,244,0.25)",
        "glow-sm": "0 0 12px rgba(124,93,244,0.2)",
        card: "0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.25)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.4), 0 16px 40px rgba(0,0,0,0.3)",
        modal: "0 24px 80px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
