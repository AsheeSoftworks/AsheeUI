/**
 * Table component styles for AsheeUI.
 * This file provides CSS class mappings for the Table component's
 * size, color, and variant options.
 */

import type { Color, Size } from "../../shared";

/**
 * CSS classes for table cell vertical padding.
 * Maps size keys to Tailwind padding-y classes.
 */
export const TABLE_CELL_PADDING_Y_CLASS: Record<Size, string> = {
  sm: "py-1.5",
  md: "py-2.5",
  lg: "py-3.5",
};

/**
 * CSS classes for table cell horizontal padding.
 * Maps size keys to Tailwind padding-x classes.
 */
export const TABLE_CELL_PADDING_X_CLASS: Record<Size, string> = {
  sm: "px-2",
  md: "px-3",
  lg: "px-4",
};

/**
 * CSS classes for table body font size.
 * Maps size keys to Tailwind text size classes.
 */
export const TABLE_FONT_CLASS: Record<Size, string> = {
  sm: "text-[0.8125rem]",
  md: "text-sm",
  lg: "text-base",
};

/**
 * CSS classes for table header font size.
 * Maps size keys to Tailwind text size classes.
 */
export const TABLE_HEADER_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-[0.8125rem]",
  lg: "text-sm",
};

/**
 * CSS classes for table color styles.
 * Each color defines styles for selected, hover, and focus states.
 */
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
  none: {
    selected: "bg-secondary text-foreground font-medium hover:bg-secondary/80",
    hover: "hover:bg-secondary/40 hover:text-foreground",
    focus:
      "focus-visible:bg-secondary/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  },
};
