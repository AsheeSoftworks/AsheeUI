import type { ChipConfig, ChipSizeScale } from "./chip-config";

export const defaultChipSizeScale: ChipSizeScale = {
  default: "md",
  values: {
    sm: {
      height: { base: "1.5rem" },
      paddingX: { base: "0.5rem" },
      fontSize: { base: "0.75rem" },
      gap: { base: "0.25rem" },
      iconSize: { base: "0.75rem" },
    },
    md: {
      height: { base: "1.75rem" },
      paddingX: { base: "0.625rem" },
      fontSize: { base: "0.875rem" },
      gap: { base: "0.375rem" },
      iconSize: { base: "0.875rem" },
    },
    lg: {
      height: { base: "2rem" },
      paddingX: { base: "0.75rem" },
      fontSize: { base: "1rem" },
      gap: { base: "0.5rem" },
      iconSize: { base: "1rem" },
    },
  },
};

export const defaultChipConfig: ChipConfig = {
  size: defaultChipSizeScale,
  radius: "full",
  animation: "none",
};
