import type { ButtonConfig, ButtonSizeScale } from "./button-config";

export const defaultButtonSizeScale: ButtonSizeScale = {
  default: "md",
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
};

export const defaultButtonConfig: ButtonConfig = {
  variant: "solid",
  size: defaultButtonSizeScale,
  animation: "scale",
};
