import type { Color } from "../../shared/variant";
import type { SpinnerSizeKey } from "./spinner-config";

export const SPINNER_SIZE_CLASS: Record<SpinnerSizeKey, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const SPINNER_COLOR_CLASS: Record<Color, string> = {
  none: "text-background",
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};
