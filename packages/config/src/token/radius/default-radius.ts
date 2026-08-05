import type { RadiusConfig } from "./radius-config";

export const defaultRadiusConfig: RadiusConfig = {
  default: "md",
  values: {
    xs: "0.125rem", // 2px
    sm: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    full: "9999px", // Fully rounded
  },
} as const;
