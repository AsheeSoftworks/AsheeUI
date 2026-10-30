/**
 * Every class string the Table renders, for the web renderer, kept side by side so a change
 * to the pattern's shape lands on the web at once. Every entry is a complete, static
 * class string, because both Tailwind and NativeWind compile the classes they can read in
 * the source.
 *
 * The web maps a table's cells, rows and header; the platform maps the rows a table becomes
 * when it is read on a device — a surface per row, holding one labelled line per column —
 * which is why the two sets are different in shape rather than only in value.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Color } from "../../../shared/variant";

// ─── Web ──────────────────────────────────────────────────────────────────────

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
