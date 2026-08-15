import type {
  MultiSelectConfig,
  MultiSelectSizeScale,
} from "./multi-select-config";

export const defaultMultiSelectSizeScale: MultiSelectSizeScale = {
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

export const defaultMultiSelectConfig: MultiSelectConfig = {
  size: defaultMultiSelectSizeScale,
  radius: "md",
  labelAlign: "left",
  animation: "none",
  chipSize: "sm",
};
