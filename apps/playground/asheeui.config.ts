import { defineConfig, type ExternalConfig } from "@ashee/ui";

const config: ExternalConfig = {
  theme: {
    defaultTheme: "company-red",
    defaultVariant: "solid",
    defaultColor: "success",
    color: {
      dark: { primary: "#38bdf8", success: "#4ade80" },
      "company-red": {
        background: "#1a0505",
        foreground: "#fef2f2",
        primary: "#dc2626",
        secondary: "#2a0a0a",
        border: "#7f1d1d",
        danger: "#f87171",
        warning: "#fb923c",
        success: "#4ade80",
        scrollbarThumb: "#991b1b",
        scrollbarTrack: "#1a0505",
      },
    },
    radius: {
      default: "none",
      values: {
        xs: "0.125rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.75rem",
        full: "9999px",
      },
    },
    shadow: {
      default: "lg",
      values: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.08)",
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.12)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.15)",
        lg: "0 12px 20px -4px rgb(0 0 0 / 0.35)",
        xl: "0 24px 32px -8px rgb(0 0 0 / 0.4)",
      },
    },
    spacing: {
      default: "lg",
      values: {
        none: "0",
        xs: "0.5rem",
        sm: "0.875rem",
        md: "1.25rem",
        lg: "2rem",
        xl: "3rem",
      },
    },
    typography: {
      weight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "700",
        bold: "800",
      },
      lineHeight: { short: "1.15", base: "1.6", tall: "1.9" },
      letterSpacing: { tight: "-0.03em", normal: "0em", wide: "0.05em" },
      family: {
        sans: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
        serif: "'Fraunces', ui-serif, Georgia, serif",
        mono: "'JetBrains Mono', ui-monospace, monospace",
      },
    },
    scrollbar: { width: "6px", radius: "4px" },
  },
  components: {
    toast: {
      variant: "underlined",
    },
    container: {
      defaultMaxWidth: "xl",
      padding: "lg",
      margin: "md",
      center: true,
    },
    flex: { gap: "lg" },
    grid: { columns: 4, gap: "lg" },
    heading: {
      levels: {
        1: {
          fontWeight: "bold",
          lineHeight: "short",
          letterSpacing: "tight",
        },
        2: {
          fontWeight: "bold",
          lineHeight: "short",
          letterSpacing: "tight",
        },
        3: {
          fontWeight: "semibold",
          lineHeight: "short",
          letterSpacing: "normal",
        },
        4: {
          fontWeight: "semibold",
          lineHeight: "base",
          letterSpacing: "normal",
        },
        5: {
          fontWeight: "medium",
          lineHeight: "base",
          letterSpacing: "normal",
        },
        6: {
          fontWeight: "medium",
          lineHeight: "base",
          letterSpacing: "normal",
        },
      },
    },
    button: {
      // variant: "bordered",
      // color: "success",
      // animation: "bounce",
      size: {
        default: "lg",
        values: {
          sm: {
            paddingX: { base: "0.75rem" },
            paddingY: { base: "0.375rem" },
            fontSize: { base: "0.875rem" },
            gap: { base: "0.375rem" },
          },
          md: {
            paddingX: { base: "1rem" },
            paddingY: { base: "0.5rem" },
            fontSize: { base: "1rem" },
            gap: { base: "0.5rem" },
          },
          lg: {
            paddingX: { base: "1.25rem", md: "1.5rem" },
            paddingY: { base: "0.625rem", md: "0.75rem" },
            fontSize: { base: "1rem", md: "1.125rem" },
            gap: { base: "0.5rem", md: "0.625rem" },
          },
        },
      },
    },
    spinner: {
      speed: "1.4s",
      size: {
        default: "md",
        values: { sm: "1rem", md: "1.35rem", lg: "1.75rem" },
      },
    },
  },
};

export default defineConfig(config);
