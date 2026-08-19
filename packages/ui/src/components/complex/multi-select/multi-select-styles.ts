import type {
  FieldSizeKey,
  FieldStatus,
} from "../../primitive/field/field-config";

export const MULTI_SELECT_HEIGHT_CLASS: Record<FieldSizeKey, string> = {
  sm: "h-9",
  md: "h-10",
  lg: "h-11.5",
};

export const MULTI_SELECT_PADDING_CLASS: Record<FieldSizeKey, string> = {
  sm: "px-2.5",
  md: "px-3",
  lg: "px-3.5",
};

export const MULTI_SELECT_FONT_CLASS: Record<FieldSizeKey, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const MULTI_SELECT_RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border focus:border-primary",
  error: "border-danger focus:border-danger",
  warning: "border-warning focus:border-warning",
  success: "border-success focus:border-success",
};
