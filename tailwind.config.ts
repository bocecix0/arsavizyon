import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1C1714",
        card: "#26201C",
        gold: "#D4A373",
        "gold-light": "#E9C46A",
        "gold-dark": "#BC6C25",
        muted: "#A39B94",
        border: "#3A322C",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-gold": "pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        shimmer: "shimmer 1.5s infinite",
        "draw-line": "drawLine 1.5s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #D4A373, #E9C46A, #D4A373)",
        "gradient-dark": "linear-gradient(180deg, #1C1714 0%, #26201C 100%)",
        shimmer:
          "linear-gradient(90deg, #26201C 25%, #3A322C 50%, #26201C 75%)",
      },
    },
  },
  plugins: [],
};

export default config;
