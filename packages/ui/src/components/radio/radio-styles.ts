import type { Color } from "../../shared/variant";
import type { FieldSizeKey, FieldStatus } from "../field/field-config";

export const RADIO_OUTER_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export const RADIO_INNER_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
};

export const RADIO_FONT_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const RADIO_GAP_CLASS: Record<FieldSizeKey, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

export const RADIO_COLOR_CLASS: Record<
  Color,
  { border: string; bg: string; cardBg: string }
> = {
  none: {
    border: "border-border",
    bg: "bg-foreground",
    cardBg: "bg-secondary/10",
  },
  primary: {
    border: "border-primary",
    bg: "bg-primary",
    cardBg: "bg-primary/10",
  },
  secondary: {
    border: "border-secondary",
    bg: "bg-secondary",
    cardBg: "bg-secondary/10",
  },
  danger: {
    border: "border-danger",
    bg: "bg-danger",
    cardBg: "bg-danger/10",
  },
  warning: {
    border: "border-warning",
    bg: "bg-warning",
    cardBg: "bg-warning/10",
  },
  success: {
    border: "border-success",
    bg: "bg-success",
    cardBg: "bg-success/10",
  },
};

export const RADIO_STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border",
  error: "border-danger",
  warning: "border-warning",
  success: "border-success",
};
