/**
 * Calendar styles for the web renderer.
 *
 * The class dictionaries live in `@asheeui/core`, beside the native ones, because a
 * calendar's decisions — which cell is chosen, how a density sizes a day, what a validation
 * status does to the field's edge — are the same on both platforms even though the strings
 * are not. This module keeps the web's import path rather than the web's copy: the rendered
 * markup is unchanged, and there is one place where a calendar's appearance is decided.
 */

export {
  CALENDAR_COLOR_CLASSES,
  DATE_PICKER_CELL_SIZE_CLASS,
  DATE_PICKER_SIZE_CLASS,
  DATE_PICKER_STATUS_BORDER_CLASS,
} from "@asheeui/core";
