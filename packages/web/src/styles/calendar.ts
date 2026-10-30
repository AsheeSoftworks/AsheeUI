/**
 * The web renderer's class dictionaries for calendar.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/calendar/calendar-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { FieldSizeKey, FieldStatus } from "@asheeui/core";
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
