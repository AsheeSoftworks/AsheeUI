import type { SelectConfig, SelectSizeScale } from "./select-config";

export const defaultSelectSizeScale: SelectSizeScale = {
  default: "md",
  values: {
    sm: {
      height: { base: "2.25rem" },
      paddingX: { base: "0.625rem" },
      fontSize: { base: "0.875rem" },
    },
    md: {
      height: { base: "2.5rem" },
      paddingX: { base: "0.75rem" },
      fontSize: { base: "1rem" },
    },
    lg: {
      height: { base: "2.875rem" },
      paddingX: { base: "0.875rem" },
      fontSize: { base: "1.125rem" },
    },
  },
};

export const defaultSelectConfig: SelectConfig = {
  size: defaultSelectSizeScale,
  radius: "md",
  labelAlign: "left",
  animation: "none",
};
