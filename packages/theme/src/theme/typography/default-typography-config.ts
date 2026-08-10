import type { TypographyConfig } from "./typography-config";

// Default Typography Configuration
export const defaultTypographyConfig: TypographyConfig = {
  size: {
    xs: { base: "0.75rem" },
    sm: { base: "0.875rem" },
    md: { base: "1rem", lg: "1.0625rem" },
    lg: { base: "1.125rem", md: "1.25rem", lg: "1.375rem" },
    xl: { base: "1.25rem", md: "1.5rem", lg: "1.75rem" },
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
    tall: "1.75",
  },
  letterSpacing: {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
  },
  family: {
    sans: "Inter, ui-sans-serif, system-ui, sans-serif",
    serif: "ui-serif, Georgia, serif",
    mono: "ui-monospace, SFMono-Regular, monospace",
  },
} as const;
