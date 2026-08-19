import { defineConfig, type ExternalConfig } from "asheeui/config";

const config: ExternalConfig = {
  theme: {
    defaultTheme: "company-red",
    defaultVariant: "solid",
    defaultColor: "danger",
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
    },
  },
  components: {
    toast: {
      variant: "underlined",
    },
    container: {
      maxWidth: "xl",
      padding: "lg",
      margin: "md",
      center: true,
    },
    flex: { gap: "lg" },
    grid: { columns: 4, gap: "lg" },
  },
};

export default defineConfig(config);
