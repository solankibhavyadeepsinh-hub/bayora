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
        // BAYORA Graphite + Teal + Steel + Indigo Identity
        bayora: {
          bg: "#0A0D10",
          deep: "#07090C",
          surface: "#11161B",
          elevated: "#171D23",
          subtle: "#1B2229",
          border: "#2A333C",
          text: "#F1F4F6",
          secondary: "#A6B0BA",
          muted: "#707B85",
          // Accents
          teal: "#4BC7B5",      // Primary Brand
          indigo: "#6675D9",    // Secondary Brand
          steel: "#5B91D6",     // Information
          green: "#42B883",     // Success
          amber: "#D6A856",     // Warning
          red: "#D96573",       // Danger
        },
        // Semantic Zone Mapping
        zone: {
          red: {
            DEFAULT: "#D96573",
            hover: "#E27B88",
            muted: "rgba(217, 101, 115, 0.10)",
            border: "rgba(217, 101, 115, 0.25)",
          },
          blue: {
            DEFAULT: "#5B91D6",
            hover: "#73A5E5",
            muted: "rgba(91, 145, 214, 0.10)",
            border: "rgba(91, 145, 214, 0.25)",
          },
          llm: {
            DEFAULT: "#6675D9",
            hover: "#7D8BE3",
            muted: "rgba(102, 117, 217, 0.10)",
            border: "rgba(102, 117, 217, 0.25)",
          },
          control: {
            DEFAULT: "#42B883",
            hover: "#56C995",
            muted: "rgba(66, 184, 131, 0.10)",
            border: "rgba(66, 184, 131, 0.25)",
          },
          audit: {
            DEFAULT: "#D6A856",
            hover: "#E2B86C",
            muted: "rgba(214, 168, 86, 0.10)",
            border: "rgba(214, 168, 86, 0.25)",
          },
        },
      },
      fontFamily: {
        heading: ["'Manrope'", "'Inter'", "sans-serif"],
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'IBM Plex Mono'", "'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "2.6rem", letterSpacing: "-0.025em", fontWeight: "700" }],
        h2: ["1.625rem", { lineHeight: "2rem", letterSpacing: "-0.02em", fontWeight: "600" }],
        h3: ["1.25rem", { lineHeight: "1.6rem", letterSpacing: "-0.015em", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.45rem", fontWeight: "400" }],
        secondary: ["0.8125rem", { lineHeight: "1.25rem", fontWeight: "400" }],
        data: ["0.75rem", { lineHeight: "1.1rem", letterSpacing: "0.01em", fontWeight: "500" }],
      },
      animation: {
        "fade-in": "fadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-bottom": "slideInBottom 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-subtle": "pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
        slideInBottom: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
