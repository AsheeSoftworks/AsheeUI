import type { TypographyConfig } from "./typography-config";

// Default Typography Configuration
export const defaultTypographyConfig: TypographyConfig = {
  size: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
  },
  weight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    short: "1.25",
    base: "1.5",
    tall: "2",
  },
  spacing: {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
  },
  family: {
    sans: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    serif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  transform: "none",
  decoration: "none",
  align: "left",
  overflow: "ellipsis",
  whitespace: "normal",
  wordbreak: "normal",
} as const;
