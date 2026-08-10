import type { SwitchConfig, SwitchSizeScale } from "./switch-config";

export const defaultSwitchSizeScale: SwitchSizeScale = {
  default: "md",
  values: {
    sm: {
      trackWidth: { base: "2rem" },
      trackHeight: { base: "1.125rem" },
      thumbSize: { base: "0.875rem" },
      thumbTranslate: { base: "0.875rem" },
      fontSize: { base: "0.875rem" },
    },
    md: {
      trackWidth: { base: "2.75rem" },
      trackHeight: { base: "1.5rem" },
      thumbSize: { base: "1.25rem" },
      thumbTranslate: { base: "1.25rem" },
      fontSize: { base: "1rem" },
    },
    lg: {
      trackWidth: { base: "3.5rem" },
      trackHeight: { base: "1.875rem" },
      thumbSize: { base: "1.5rem" },
      thumbTranslate: { base: "1.625rem" },
      fontSize: { base: "1.125rem" },
    },
  },
};

export const defaultSwitchConfig: SwitchConfig = {
  size: defaultSwitchSizeScale,
  color: "primary",
  radius: "full",
  labelAlign: "left",
  animation: "scale",
};
