import type { RadioConfig, RadioSizeScale } from "./radio-config";

export const defaultRadioSizeScale: RadioSizeScale = {
  default: "md",
  values: {
    sm: {
      outerSize: { base: "1rem" },
      innerSize: { base: "0.5rem" },
      fontSize: { base: "0.875rem" },
      gap: { base: "0.5rem" },
    },
    md: {
      outerSize: { base: "1.25rem" },
      innerSize: { base: "0.625rem" },
      fontSize: { base: "1rem" },
      gap: { base: "0.75rem" },
    },
    lg: {
      outerSize: { base: "1.5rem" },
      innerSize: { base: "0.75rem" },
      fontSize: { base: "1.125rem" },
      gap: { base: "0.875rem" },
    },
  },
};

export const defaultRadioConfig: RadioConfig = {
  size: defaultRadioSizeScale,
  radius: "full",
  variant: "default",
  animation: "none",
};
