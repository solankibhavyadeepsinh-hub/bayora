/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Bayora Design System Palette
        bayora: {
          bg: "#070A0F",
          secondary: "#0B1017",
          surface: "#101720",
          elevated: "#151D27",
          border: "#25303C",
          "border-subtle": "#1B252F",
          text: "#F5F7FA",
          "text-secondary": "#A4AFBC",
          muted: "#6C7886",
          cyan: "#39D9FF",
          violet: "#8C7DFF",
          success: "#38D996",
          warning: "#FFB84D",
          danger: "#FF6074",
          info: "#5D9CFF",
        },
        // Zone Semantic Palette
        zone: {
          red: {
            DEFAULT: "#FF6074",
            hover: "#FF788A",
            muted: "rgba(255, 96, 116, 0.12)",
            border: "rgba(255, 96, 116, 0.28)",
          },
          blue: {
            DEFAULT: "#5D9CFF",
            hover: "#78AEFF",
            muted: "rgba(93, 156, 255, 0.12)",
            border: "rgba(93, 156, 255, 0.28)",
          },
          llm: {
            DEFAULT: "#8C7DFF",
            hover: "#A397FF",
            muted: "rgba(140, 125, 255, 0.12)",
            border: "rgba(140, 125, 255, 0.28)",
          },
          control: {
            DEFAULT: "#38D996",
            hover: "#50E0A6",
            muted: "rgba(56, 217, 150, 0.12)",
            border: "rgba(56, 217, 150, 0.28)",
          },
          audit: {
            DEFAULT: "#FFB84D",
            hover: "#FFC66E",
            muted: "rgba(255, 184, 77, 0.12)",
            border: "rgba(255, 184, 77, 0.28)",
          },
        },
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-in-right": "slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
