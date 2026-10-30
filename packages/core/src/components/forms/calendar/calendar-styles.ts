/**
 * The Calendar's class dictionaries, for the web renderer.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones, side by
 * side, and they differ deliberately in one place: a day cell on the web is sized for a
 * pointer, and a day cell on native is a touch target, so the smallest native cell is a
 * thumb's width rather than the web's smallest square. Everything else is the same
 * decision — which cell is chosen, which one is today, what a surface's heading looks like —
 * so a reader moving between the platforms reads one calendar rather than two.
 *
 * The colour a calendar draws with is a role rather than a class string, because which role
 * a cell takes is decided by what the cell *means*: the chosen day takes the field's accent,
 * today takes its edge, and a cell the reader may not press is faded rather than recoloured.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Color } from "../../../shared/variant";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * The calendar's treatment for each colour role.
 *
 * `bg` and its text are what a chosen day wears, `text` is the accent a cell's hover and a
 * time column's controls take, `border` marks today, and `hover` is the resting treatment of
 * a cell the reader is pointing at.
 *
 * The neutral role takes the framework's foreground and background rather than a colour, so
 * a calendar configured with `none` is drawn in the application's own text colour instead of
 * borrowing an accent role the consumer did not choose.
 */
export const CALENDAR_COLOR_CLASSES: Record<
  Color,
  { bg: string; text: string; border: string; hover: string }
> = {
  none: {
    bg: "bg-foreground text-background",
    text: "text-foreground",
    border: "border-foreground",
    hover: "hover:text-foreground hover:bg-secondary",
  },
  primary: {
    bg: "bg-primary text-primary-foreground",
    text: "text-primary",
    border: "border-primary",
    hover: "hover:text-primary hover:bg-primary/10",
  },
  secondary: {
    bg: "bg-secondary text-foreground/70",
    text: "text-secondary",
    border: "border-secondary",
    hover: "hover:text-secondary hover:bg-secondary/10",
  },
  success: {
    bg: "bg-success text-success-foreground",
    text: "text-success",
    border: "border-success",
    hover: "hover:text-success hover:bg-success/10",
  },
  warning: {
    bg: "bg-warning text-warning-foreground",
    text: "text-warning",
    border: "border-warning",
    hover: "hover:text-warning hover:bg-warning/10",
  },
  danger: {
    bg: "bg-danger text-danger-foreground",
    text: "text-danger",
    border: "border-danger",
    hover: "hover:text-danger hover:bg-danger/10",
  },
};

// ─── Native ───────────────────────────────────────────────────────────────────
