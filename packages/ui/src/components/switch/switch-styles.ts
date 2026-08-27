import type { FieldSizeKey, FieldStatus } from "../field/field-config";

export const SWITCH_TRACK_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "w-8 h-4.5 p-0.5",
  md: "w-11 h-6 p-0.5",
  lg: "w-14 h-7.5 p-1",
  xl: "w-16 h-9 p-1",
};

export const SWITCH_THUMB_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "size-3.5",
  md: "size-5",
  lg: "size-5.5",
  xl: "size-7",
};

export const SWITCH_THUMB_TRANSLATE_CLASS: Record<FieldSizeKey, string> = {
  sm: "translate-x-3.5",
  md: "translate-x-5",
  lg: "translate-x-6",
  xl: "translate-x-7",
};

export const SWITCH_STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border/60",
  error: "border-danger",
  warning: "border-warning",
  success: "border-success",
};
