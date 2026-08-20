import type { Color } from "../../shared/variant";
import type { TableSizeKey } from "./table-config";

export const TABLE_CELL_PADDING_Y_CLASS: Record<TableSizeKey, string> = {
  sm: "py-1.5",
  md: "py-2.5",
  lg: "py-3.5",
};

export const TABLE_CELL_PADDING_X_CLASS: Record<TableSizeKey, string> = {
  sm: "px-2",
  md: "px-3",
  lg: "px-4",
};

export const TABLE_FONT_CLASS: Record<TableSizeKey, string> = {
  sm: "text-[0.8125rem]",
  md: "text-sm",
  lg: "text-base",
};

export const TABLE_HEADER_FONT_CLASS: Record<TableSizeKey, string> = {
  sm: "text-xs",
  md: "text-[0.8125rem]",
  lg: "text-sm",
};

export const TABLE_RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const TABLE_COLOR_STYLES: Record<
  Color,
  { selected: string; hover: string; focus: string }
> = {
  primary: {
    selected:
      "bg-primary text-secondary font-medium hover:bg-primary/90 hover:text-secondary",
    hover: "hover:bg-primary/10 hover:text-foreground",
    focus:
      "focus-visible:bg-primary/15 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset",
  },
  secondary: {
    selected:
      "bg-secondary text-foreground font-medium hover:bg-secondary/90 hover:text-foreground",
    hover: "hover:bg-secondary/10 hover:text-foreground",
    focus:
      "focus-visible:bg-secondary/15 focus-visible:ring-1 focus-visible:ring-secondary focus-visible:ring-inset",
  },
  danger: {
    selected:
      "bg-danger text-secondary font-medium hover:bg-danger/90 hover:text-secondary",
    hover: "hover:bg-danger/10 hover:text-foreground",
    focus:
      "focus-visible:bg-danger/15 focus-visible:ring-1 focus-visible:ring-danger focus-visible:ring-inset",
  },
  warning: {
    selected:
      "bg-warning text-secondary font-medium hover:bg-warning/90 hover:text-secondary",
    hover: "hover:bg-warning/10 hover:text-foreground",
    focus:
      "focus-visible:bg-warning/15 focus-visible:ring-1 focus-visible:ring-warning focus-visible:ring-inset",
  },
  success: {
    selected:
      "bg-success text-secondary font-medium hover:bg-success/90 hover:text-secondary",
    hover: "hover:bg-success/10 hover:text-foreground",
    focus:
      "focus-visible:bg-success/15 focus-visible:ring-1 focus-visible:ring-success focus-visible:ring-inset",
  },
  default: {
    selected: "bg-secondary text-foreground font-medium hover:bg-secondary/80",
    hover: "hover:bg-foreground/10 hover:text-foreground",
    focus:
      "focus-visible:bg-foreground/10 focus-visible:ring-1 focus-visible:ring-border focus-visible:ring-inset",
  },
  none: {
    selected: "bg-muted text-foreground font-medium hover:bg-muted/80",
    hover: "hover:bg-muted/40 hover:text-foreground",
    focus:
      "focus-visible:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  },
};
