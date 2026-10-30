/**
 * The platform's class dictionaries for calendar.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/forms/calendar/calendar-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { Color, FieldSizeKey } from "@asheeui/core";

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
