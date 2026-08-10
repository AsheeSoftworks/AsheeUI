import type { RadiusConfig } from "./radius-config";

export const defaultRadiusConfig: RadiusConfig = {
  default: "md",
  values: {
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    full: "9999px",
  },
} as const;
