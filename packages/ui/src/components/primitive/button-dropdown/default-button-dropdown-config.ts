import type {
  ButtonDropdownConfig,
  ButtonDropdownSizeScale,
} from "./button-dropdown-config";

export const defaultButtonDropdownSizeScale: ButtonDropdownSizeScale = {
  default: "md",
  values: {
    sm: {
      height: { base: "2.25rem" },
      paddingX: { base: "0.75rem" },
      fontSize: { base: "0.875rem" },
    },
    md: {
      height: { base: "2.5rem" },
      paddingX: { base: "1rem" },
      fontSize: { base: "1rem" },
    },
    lg: {
      height: { base: "2.875rem" },
      paddingX: { base: "1.25rem" },
      fontSize: { base: "1.125rem" },
    },
  },
};

export const defaultButtonDropdownConfig: ButtonDropdownConfig = {
  size: defaultButtonDropdownSizeScale,
  radius: "md",
  variant: "bordered",
  animation: "scale",
};
