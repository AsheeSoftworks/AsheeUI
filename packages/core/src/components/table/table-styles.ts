/**
 * Every class string the Table renders, for both renderers, kept side by side so a change
 * to the pattern's shape lands on both platforms at once. Every entry is a complete, static
 * class string, because both Tailwind and NativeWind compile the classes they can read in
 * the source.
 *
 * The web maps a table's cells, rows and header; the platform maps the rows a table becomes
 * when it is read on a device — a surface per row, holding one labelled line per column —
 * which is why the two sets are different in shape rather than only in value.
 */

import type { Size } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";
import type { TableVariant } from "./table-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

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

// ─── Native ───────────────────────────────────────────────────────────────────

/**
 * The native list of rows.
 *
 * The web draws one element per cell in a grid; the platform draws a surface per row,
 * because a table is not a reading pattern a thumb can follow. The list is a column of those
 * surfaces with the framework's own gap between them.
 */
export const NATIVE_ROW_LIST_CLASS = "w-full flex flex-col gap-3";

/** One native row's own arrangement: its labelled lines, in order. */
export const NATIVE_ROW_LIST_ROW_CLASS = "w-full flex flex-col gap-2";

/** One labelled line: the column's header beside the cell it names. */
export const NATIVE_ROW_LIST_FIELD_CLASS =
  "flex flex-row items-start justify-between gap-3";

/**
 * The cell side of a labelled line, which takes the room the label leaves.
 * The row states the separation, so a long value wraps rather than overflowing.
 */
export const NATIVE_ROW_LIST_VALUE_CLASS = "flex flex-1 flex-col items-end";

/**
 * The accent a chosen native row carries, per colour role.
 *
 * The platform's card states its accent as a border colour, and its own border already
 * carries the theme's muted accent, so a chosen row states the accent fully rather than at
 * the card's default weight — which is what makes the chosen row visibly chosen. The class
 * is applied last, so it is what the row's border resolves to.
 */
export const NATIVE_ROW_LIST_SELECTED_CLASS: Record<Color, string> = {
  none: "border-foreground/60",
  primary: "border-primary",
  secondary: "border-secondary",
  danger: "border-danger",
  warning: "border-warning",
  success: "border-success",
};

/**
 * The surface each native row is drawn on, per variant.
 *
 * The web's variants describe how cells are separated from each other — grid lines, bands,
 * an outer border, or nothing. The platform draws each row as its own surface, so the
 * variants resolve to the surface treatment each one asks for: a defined surface for the two
 * that separate cells with an edge, the framework's tinted surface for the striped variant
 * (each row is already separated, so the tint is what the band becomes), and no surface at
 * all for the ghost variant. `none` is not reachable: every variant here is a surface a row
 * can be drawn on.
 */
export const NATIVE_ROW_LIST_SURFACE: Record<TableVariant, Variant> = {
  grid: "bordered",
  striped: "faded",
  bordered: "bordered",
  ghost: "ghost",
};
