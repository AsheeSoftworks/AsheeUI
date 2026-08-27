import type { FieldSizeKey, FieldStatus, LabelAlign } from "./field-config";

export const FIELD_LABEL_ALIGN_CLASS: Record<LabelAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const FIELD_STATUS_TEXT_CLASS: Record<FieldStatus, string> = {
  default: "text-foreground",
  error: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

export const FIELD_LABEL_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export const FIELD_DESCRIPTION_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};

export const FIELD_MESSAGE_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};

export const FIELD_SHELL_GAP_CLASS: Record<FieldSizeKey, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
  xl: "gap-2.5",
};
