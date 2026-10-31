/**
 * The web renderer's class dictionaries for calendar.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/calendar/calendar-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 *
 * `CALENDAR_COLOR_CLASSES` was the last one to arrive, in C3: it is the colour treatment each role
 * gives a chosen day, and the platform draws the same decision with its own keys
 * (`NATIVE_CALENDAR_COLOR_CLASS`: `bg`, `on`, `border`, `text`) rather than these, because a
 * device has no `hover:` state. Its module in core held nothing else and went with it.
 */

import type { Color, FieldSizeKey, FieldStatus } from "@asheeui/core";
import { FIELD_STATUS_BORDER_CLASS } from "./field";

/**
 * The field itself, for each density.
 * The web states a height, since its scale is fixed by the stylesheet.
 */
export const DATE_PICKER_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};

/**
 * One day cell, for each density.
 * Sized in squares rather than in rows, because a month is read as a grid.
 */
export const DATE_PICKER_CELL_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "size-7 text-xs",
  md: "size-8 text-xs",
  lg: "size-9 text-sm",
};

/**
 * The field's edge for each validation status.
 * A calendar is a field, so the edge its validation decides is the family's.
 */
export const DATE_PICKER_STATUS_BORDER_CLASS: Record<FieldStatus, string> =
  FIELD_STATUS_BORDER_CLASS;

/**
 * The calendar's treatment for each colour role, on the web.
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
