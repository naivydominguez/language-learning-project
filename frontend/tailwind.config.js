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
        "background-light": "var(--background-light)",
        background: "var(--background)",
        "background-dark": "var(--background-dark)",

        // ── Base ─────────────────────────────────
        white: "var(--white)",
        black: "var(--black)",

        // ── Foreground ───────────────────────────
        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        "foreground-tertiary": "var(--foreground-tertiary)",

        // ── Primary ──────────────────────────────
        "primary-light": "var(--primary-light)",
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",

        // ── Secondary ────────────────────────────
        "secondary-light": "var(--secondary-light)",
        secondary: "var(--secondary)",
        "secondary-dark": "var(--secondary-dark)",

        // ── Warning ──────────────────────────────
        warning: "var(--warning)",
        "warning-dark": "var(--warning-dark)",

        // ── Destructive ──────────────────────────
        destructive: "var(--destructive)",

        // ── Info ─────────────────────────────────
        "info-light": "var(--info-light)",
        info: "var(--info)",
        "info-dark": "var(--info-dark)",
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
