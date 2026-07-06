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
      },
      colors: {
        background: "var(--background)",
        "background-subtle": "var(--background-subtle)",
        "background-element": "var(--background-element)",
        surface: "var(--surface)",

        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        "foreground-tertiary": "var(--foreground-tertiary)",
        "foreground-placeholder": "var(--foreground-placeholder)",

        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-strong": "var(--accent-strong)",
        "accent-subtle": "var(--accent-subtle)",
        "accent-subtle-fg": "var(--accent-subtle-fg)",
        "accent-fg": "var(--accent-fg)",

        secondary: "var(--secondary)",
        "secondary-subtle": "var(--secondary-subtle)",
        "secondary-subtle-fg": "var(--secondary-subtle-fg)",
        "secondary-fg": "var(--secondary-fg)",

        success: "var(--success)",
        "success-subtle": "var(--success-subtle)",
        warning: "var(--warning)",
        "warning-subtle": "var(--warning-subtle)",
        error: "var(--error)",
        "error-subtle": "var(--error-subtle)",
        info: "var(--info)",
        "info-subtle": "var(--info-subtle)",

        "word-new": "var(--word-new)",
        "word-new-bg": "var(--word-new-bg)",
        "word-known": "var(--word-known)",
        "word-known-bg": "var(--word-known-bg)",

        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",

        // Sidebar — aliased to closest existing tokens (no dedicated sidebar vars in global.css)
        sidebar: "var(--background-subtle)",
        "sidebar-foreground": "var(--foreground)",
        "sidebar-primary": "var(--accent)",
        "sidebar-primary-foreground": "var(--accent-fg)",
        "sidebar-accent": "var(--accent-subtle)",
        "sidebar-accent-foreground": "var(--accent-subtle-fg)",
        "sidebar-border": "var(--border)",
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
