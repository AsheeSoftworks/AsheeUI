import type { FieldSizeKey, FieldStatus } from "../field/field-config";

export const TEXTAREA_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "p-2 text-xs",
  md: "p-3 text-sm",
  lg: "p-4 text-base",
  xl: "p-4 text-md",
};

export const TEXTAREA_STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "",
  error:
    "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
  warning:
    "border-warning focus-visible:border-warning focus-visible:ring-warning/20",
  success:
    "border-success focus-visible:border-success focus-visible:ring-success/20",
};
