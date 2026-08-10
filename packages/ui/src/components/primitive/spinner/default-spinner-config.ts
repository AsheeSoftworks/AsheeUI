import type { SpinnerSizeScale } from "./spinner-config";

export const defaultSpinnerSizeScale: SpinnerSizeScale = {
  default: "md",
  values: { sm: "0.875rem", md: "1rem", lg: "1.25rem" },
};

export const defaultSpinnerConfig = {
  size: defaultSpinnerSizeScale,
  speed: "0.75s",
};
