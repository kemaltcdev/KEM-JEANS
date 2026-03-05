import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // KEM JEANS Brand Palette
        "kem-black": "#0E0E0E",
        "kem-ivory": "#F4F4F2",
        "kem-charcoal": "#1A1A1A",
        "kem-gold": "#B89F5B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "super-wide": "0.25em",
      },
      animation: {
        "fade-slide-up": "fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
