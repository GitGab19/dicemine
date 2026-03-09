import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        bitcoin: {
          orange: "#f7931a",
          "orange-light": "#ffb347",
          "orange-dark": "#c77008",
          dark: "#0f0f0f",
          surface: "#161616",
          border: "#2a2a2a",
        },
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(247, 147, 26, 0.25)",
        card: "0 4px 24px -4px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out forwards",
        "scale-in": "scale-in 0.35s ease-out forwards",
        "result-pop": "result-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "block-glow": "block-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s linear infinite",
        "table-row-in": "table-row-in 0.3s ease-out forwards",
        "dice-tumble": "dice-tumble 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "result-pop": {
          from: { opacity: "0", transform: "scale(0.92) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "block-glow": {
          "0%, 100%": { boxShadow: "0 0 24px -4px rgba(247, 147, 26, 0.25)" },
          "50%": { boxShadow: "0 0 32px 0 rgba(247, 147, 26, 0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "table-row-in": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "dice-tumble": {
          "0%": { transform: "translateZ(-32px) rotateX(0deg) rotateY(0deg)" },
          "100%": { transform: "translateZ(-32px) rotateX(760deg) rotateY(400deg)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
