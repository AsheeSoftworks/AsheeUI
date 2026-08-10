import type { FieldSizeScale } from "./field-config";

export const defaultFieldSizeScale: FieldSizeScale = {
  default: "md",
  values: {
    sm: {
      paddingX: { base: "0.625rem" },
      paddingY: { base: "0.375rem" },
      fontSize: { base: "0.875rem" },
    },
    md: {
      paddingX: { base: "0.75rem" },
      paddingY: { base: "0.5rem" },
      fontSize: { base: "1rem" },
    },
    lg: {
      paddingX: { base: "1rem", md: "1.25rem" },
      paddingY: { base: "0.625rem", md: "0.75rem" },
      fontSize: { base: "1.125rem", md: "1.25rem" },
    },
  },
};
