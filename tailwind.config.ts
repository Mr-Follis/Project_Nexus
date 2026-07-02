import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace"
        ]
      },
      colors: {
        bg: {
          base: "rgb(var(--color-bg-base) / <alpha-value>)",
          surface: "rgb(var(--color-bg-surface) / <alpha-value>)",
          elevated: "rgb(var(--color-bg-elevated) / <alpha-value>)"
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)"
        },
        accent: {
          primary: "rgb(var(--color-accent-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-accent-secondary) / <alpha-value>)"
        },
        status: {
          success: "rgb(var(--color-status-success) / <alpha-value>)",
          warning: "rgb(var(--color-status-warning) / <alpha-value>)",
          danger: "rgb(var(--color-status-danger) / <alpha-value>)"
        }
      },
      borderRadius: {
        nexus: "var(--radius-nexus)"
      },
      boxShadow: {
        glow: "0 0 40px rgb(var(--color-accent-primary) / 0.18)"
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        enter: "var(--ease-enter)",
        exit: "var(--ease-exit)"
      }
    }
  },
  plugins: []
};

export default config;
