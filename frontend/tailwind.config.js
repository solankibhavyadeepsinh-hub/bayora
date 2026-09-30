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
        // High-End Enterprise Security Palette
        bayora: {
          bg: "#080A0D",
          secondary: "#0D1116",
          surface: "#12171D",
          elevated: "#171D24",
          border: "#252D36",
          "border-subtle": "#1C242C",
          text: "#EEF2F5",
          "text-secondary": "#A3ADB7",
          muted: "#68737E",
          accent: "#4FD1C5",
          violet: "#7C8CFF",
          success: "#45C995",
          warning: "#E6B35A",
          danger: "#E66A77",
          info: "#6EA8FE",
        },
        // Semantic Zone Mapping
        zone: {
          red: {
            DEFAULT: "#E66A77",
            hover: "#F07B88",
            muted: "rgba(230, 106, 119, 0.10)",
            border: "rgba(230, 106, 119, 0.25)",
          },
          blue: {
            DEFAULT: "#6EA8FE",
            hover: "#84B7FF",
            muted: "rgba(110, 168, 254, 0.10)",
            border: "rgba(110, 168, 254, 0.25)",
          },
          llm: {
            DEFAULT: "#7C8CFF",
            hover: "#92A0FF",
            muted: "rgba(124, 140, 255, 0.10)",
            border: "rgba(124, 140, 255, 0.25)",
          },
          control: {
            DEFAULT: "#45C995",
            hover: "#59D7A5",
            muted: "rgba(69, 201, 149, 0.10)",
            border: "rgba(69, 201, 149, 0.25)",
          },
          audit: {
            DEFAULT: "#E6B35A",
            hover: "#F0C16C",
            muted: "rgba(230, 179, 90, 0.10)",
            border: "rgba(230, 179, 90, 0.25)",
          },
        },
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-restrained": "pulseRestrained 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseRestrained: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
