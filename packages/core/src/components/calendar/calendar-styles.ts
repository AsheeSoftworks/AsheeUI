/**
 * The Calendar's class dictionaries, for both renderers.
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
 */

import type { Color } from "../../shared/variant";
import type { FieldSizeKey, FieldStatus } from "../field/field-config";
import { FIELD_STATUS_BORDER_CLASS } from "../field/field-styles";

// ─── Web ──────────────────────────────────────────────────────────────────────

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

/**
 * The field's own trigger, which the surface opens from.
 *
 * The value is held to the left and the controls to the right, because the value is what the
 * reader came to read and the controls are what they reach for once they have.
 */
export const NATIVE_CALENDAR_TRIGGER_CLASS =
  "flex-row items-center justify-between gap-2";

/** The controls inside the trigger: what empties the field and what says it collects a date. */
export const NATIVE_CALENDAR_TRIGGER_ACTIONS_CLASS =
  "flex-row items-center gap-2";

/** The control inside the trigger that empties the field. */
export const NATIVE_CALENDAR_TRIGGER_CLEAR_CLASS = "justify-center px-1";

/** The glyph inside that control. */
export const NATIVE_CALENDAR_TRIGGER_CLEAR_LABEL_CLASS =
  "text-sm text-foreground/70";

/** The glyph that says what the field collects. */
export const NATIVE_CALENDAR_TRIGGER_GLYPH_CLASS = "text-foreground/60";

/** The surface's content: the month above the time columns. */
export const NATIVE_CALENDAR_SHEET_CLASS = "w-full flex-col gap-4";

/** The month grid: the heading, the weekday row and the weeks under them. */
export const NATIVE_CALENDAR_MONTH_GRID_CLASS = "flex-col gap-1";

/** The row that holds the month and the two controls that move between months. */
export const NATIVE_CALENDAR_HEADER_CLASS =
  "flex-row items-center justify-between gap-2 border-b border-border pb-2";

/** The month and year the surface is showing. */
export const NATIVE_CALENDAR_MONTH_CLASS =
  "text-base font-semibold text-foreground";

/** A control that moves the surface by one month. */
export const NATIVE_CALENDAR_NAV_CLASS =
  "w-11 h-11 items-center justify-center";

/** The arrow inside a month control. */
export const NATIVE_CALENDAR_NAV_LABEL_CLASS = "text-lg text-foreground/70";

/** A control the reader cannot use, such as the month after today's. */
export const NATIVE_CALENDAR_UNAVAILABLE_CLASS = "opacity-30";

/** The row of weekday headings above the grid. */
export const NATIVE_CALENDAR_WEEKDAYS_CLASS = "flex-row";

/** One weekday heading, as wide as the column of days beneath it. */
export const NATIVE_CALENDAR_WEEKDAY_CLASS =
  "flex-1 text-xs font-bold uppercase tracking-wide text-foreground/50 text-center py-1";

/** One week of the month. */
export const NATIVE_CALENDAR_ROW_CLASS = "flex-row";

/**
 * One day cell, for each density.
 *
 * The cell states its height and takes its width from the row, which is what keeps a week
 * of seven the same shape as the headings above it whatever width the surface has. The
 * smallest is a thumb's height rather than the web's smallest square, because a cell a
 * thumb cannot hit is a defect rather than a style choice.
 */
export const NATIVE_CALENDAR_CELL_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "h-10",
  md: "h-11",
  lg: "h-12",
};

/** What every day cell shares, whatever it means. */
export const NATIVE_CALENDAR_CELL_CLASS =
  "flex-1 items-center justify-center rounded-md border border-transparent";

/** The cell a reader may not press, which is faded rather than recoloured. */
export const NATIVE_CALENDAR_CELL_DISABLED_CLASS = "opacity-30";

/** The number inside a day cell. */
export const NATIVE_CALENDAR_CELL_TEXT_CLASS =
  "text-sm text-foreground text-center";

/** The row that holds the time columns. */
export const NATIVE_CALENDAR_TIME_ROW_CLASS =
  "flex-row items-center justify-center gap-5";

/** One column of a time: its name, its value and the controls that change it. */
export const NATIVE_CALENDAR_TIME_COLUMN_CLASS = "items-center gap-1";

/** A time column's name, such as `HH`. */
export const NATIVE_CALENDAR_TIME_LABEL_CLASS =
  "text-xs font-medium uppercase tracking-widest text-foreground/50";

/** A control that steps a time column by one. */
export const NATIVE_CALENDAR_STEP_CLASS =
  "w-11 h-10 items-center justify-center";

/** The glyph inside a step control. */
export const NATIVE_CALENDAR_STEP_LABEL_CLASS = "text-base text-foreground/70";

/** The box a time column's value is shown in. */
export const NATIVE_CALENDAR_TIME_VALUE_CLASS =
  "min-w-[48px] h-11 items-center justify-center rounded-md border border-border";

/** The value a time column holds. */
export const NATIVE_CALENDAR_TIME_VALUE_TEXT_CLASS =
  "text-base font-semibold text-foreground";

/** The row that holds the surface's own controls. */
export const NATIVE_CALENDAR_FOOTER_CLASS =
  "flex-row items-center justify-between border-t border-border pt-3";

/** The control that empties the field. */
export const NATIVE_CALENDAR_CLEAR_CLASS = "min-h-[44px] px-2 justify-center";

/** The label of the control that empties the field. */
export const NATIVE_CALENDAR_CLEAR_LABEL_CLASS =
  "text-sm font-medium text-foreground/60";

/** The label of the control that accepts what the surface holds. */
export const NATIVE_CALENDAR_DONE_LABEL_CLASS = "text-sm font-semibold";

/** The control that accepts what the surface holds. */
export const NATIVE_CALENDAR_DONE_CLASS =
  "min-h-[44px] px-4 rounded-md justify-center";

/**
 * The calendar's treatment for each colour role.
 *
 * The keys are the web's, minus the one the platform has no use for: a chosen day is filled
 * with the accent and its number written on that fill, the accent also colours today's edge
 * and today's number, and the control that accepts the value is the same fill as a chosen
 * day. There is no `hover`, because the platform has no pointer to rest on a cell.
 */
export const NATIVE_CALENDAR_COLOR_CLASS: Record<
  Color,
  {
    /** The fill a chosen day wears, and the one the accepting control is drawn with. */
    bg: string;
    /** The text written on that fill. */
    on: string;
    /** The accent as a border, which marks today. */
    border: string;
    /** The accent as text, which marks today's number. */
    text: string;
  }
> = {
  none: {
    bg: "bg-foreground",
    on: "text-background",
    border: "border-foreground",
    text: "text-foreground",
  },
  primary: {
    bg: "bg-primary",
    on: "text-background",
    border: "border-primary",
    text: "text-primary",
  },
  secondary: {
    bg: "bg-secondary",
    on: "text-foreground",
    border: "border-secondary",
    text: "text-secondary",
  },
  success: {
    bg: "bg-success",
    on: "text-background",
    border: "border-success",
    text: "text-success",
  },
  warning: {
    bg: "bg-warning",
    on: "text-background",
    border: "border-warning",
    text: "text-warning",
  },
  danger: {
    bg: "bg-danger",
    on: "text-background",
    border: "border-danger",
    text: "text-danger",
  },
};
