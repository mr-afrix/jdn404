import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        line: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        card2: "hsl(var(--card-2))",
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          bright: "hsl(var(--primary-bright))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
      },
      borderRadius: {
        xl: "1.125rem",
        lg: "0.875rem",
        md: "0.625rem",
        sm: "0.4375rem",
      },
      boxShadow: {
        panel: "0 30px 70px -50px hsl(var(--foreground) / 0.55), 0 1px 0 hsl(var(--foreground) / 0.05) inset",
        lift: "0 20px 40px -26px hsl(var(--primary) / 0.6)",
      },
      keyframes: {
        caret: {
          "0%, 45%": { opacity: "1" },
          "50%, 95%": { opacity: "0.15" },
          "100%": { opacity: "1" },
        },
        ping: {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "75%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        caret: "caret 1.1s steps(1) infinite",
        ping: "ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
} satisfies Config;
