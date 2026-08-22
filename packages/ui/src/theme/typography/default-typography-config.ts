import type { TypographyConfig } from "./typography-config";

// Default Typography Configuration
export const defaultTypographyConfig: TypographyConfig = {
  size: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
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
} as const;
