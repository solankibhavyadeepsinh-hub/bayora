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
        zone: {
          red: {
            DEFAULT: "#E5484D",
            hover: "#F2555A",
            muted: "rgba(229, 72, 77, 0.15)",
            border: "rgba(229, 72, 77, 0.35)",
            glow: "rgba(229, 72, 77, 0.25)",
          },
          blue: {
            DEFAULT: "#3B82F6",
            hover: "#60A5FA",
            muted: "rgba(59, 130, 246, 0.15)",
            border: "rgba(59, 130, 246, 0.35)",
            glow: "rgba(59, 130, 246, 0.25)",
          },
          llm: {
            DEFAULT: "#8B5CF6",
            hover: "#A78BFA",
            muted: "rgba(139, 92, 246, 0.15)",
            border: "rgba(139, 92, 246, 0.35)",
            glow: "rgba(139, 92, 246, 0.25)",
          },
          control: {
            DEFAULT: "#10B981",
            hover: "#34D399",
            muted: "rgba(16, 185, 129, 0.15)",
            border: "rgba(16, 185, 129, 0.35)",
            glow: "rgba(16, 185, 129, 0.25)",
          },
        },
        background: "#090D16",
        surface: {
          DEFAULT: "#0F172A",
          subtle: "#131E35",
          border: "#1E293B",
          hover: "#1A2642",
        },
        foreground: "#F8FAFC",
        muted: {
          DEFAULT: "#64748B",
          foreground: "#94A3B8",
        },
        border: "#1E293B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
