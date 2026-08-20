import type { FieldSizeKey, FieldStatus } from "../field/field-config";

export const SWITCH_TRACK_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "w-8 h-4.5 p-0.5",
  md: "w-11 h-6 p-0.5",
  lg: "w-14 h-7.5 p-1",
};

export const SWITCH_THUMB_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "size-3.5",
  md: "size-5",
  lg: "size-5.5",
};

export const SWITCH_THUMB_TRANSLATE_X: Record<FieldSizeKey, number> = {
  sm: 14,
  md: 20,
  lg: 24,
};

export const SWITCH_RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const SWITCH_STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border/60",
  error: "border-danger",
  warning: "border-warning",
  success: "border-success",
};
