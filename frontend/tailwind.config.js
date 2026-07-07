/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DMSans-Regular"],
        serif: ["Lora-Regular"],
        mono: ["JetBrainsMono-Regular"],
        display: ["var(--font-display)"],
        rounded: ["var(--font-rounded)"],
      },
      fontSize: {
        base: "var(--font-size)",
      },
      fontWeight: {
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
        semi: "var(--font-weight-semi)",
        bold: "var(--font-weight-bold)",
      },
      colors: {
        // ── Backgrounds ──────────────────────────
        "background-light": "rgb(var(--background-light) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        "background-dark": "rgb(var(--background-dark) / <alpha-value>)",

        // ── Base ─────────────────────────────────
        white: "rgb(var(--white) / <alpha-value>)",
        black: "rgb(var(--black) / <alpha-value>)",

        // ── Foreground ───────────────────────────
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "foreground-secondary": "rgb(var(--foreground-secondary) / <alpha-value>)",
        "foreground-tertiary": "rgb(var(--foreground-tertiary) / <alpha-value>)",

        // ── Primary ──────────────────────────────
        "primary-light": "rgb(var(--primary-light) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--primary-dark) / <alpha-value>)",

        // ── Secondary ────────────────────────────
        "secondary-light": "rgb(var(--secondary-light) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-dark": "rgb(var(--secondary-dark) / <alpha-value>)",

        // ── Warning ──────────────────────────────
        warning: "rgb(var(--warning) / <alpha-value>)",
        "warning-dark": "rgb(var(--warning-dark) / <alpha-value>)",

        // ── Destructive ──────────────────────────
        destructive: "rgb(var(--destructive) / <alpha-value>)",

        // ── Info ─────────────────────────────────
        "info-light": "rgb(var(--info-light) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        "info-dark": "rgb(var(--info-dark) / <alpha-value>)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        modal: "var(--shadow-modal)",
        inner: "var(--shadow-inner)",
      },
      transitionTimingFunction: {
        default: "var(--ease-default)",
        spring: "var(--ease-spring)",
        out: "var(--ease-out)",
        in: "var(--ease-in)",
      },
      transitionDuration: {
        instant: "var(--duration-instant)",
        fast: "var(--duration-fast)",
        default: "var(--duration-default)",
        enter: "var(--duration-enter)",
        exit: "var(--duration-exit)",
        slow: "var(--duration-slow)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        full: "var(--radius-full)",
      },
    },
  },
  plugins: [],
};
