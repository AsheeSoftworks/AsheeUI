/**
 * Calendar styles for the web renderer.
 *
 * The class dictionaries live in `../../../styles/calendar`, which is where Tailwind can read
 * them: a calendar's appearance is a set of class strings, and a class string can only be stated
 * in the package that compiles it. This module keeps the component's import path, so the calendar
 * reads one module and every dictionary a day cell needs is exported from one place.
 */

export {
  CALENDAR_COLOR_CLASSES,
  DATE_PICKER_CELL_SIZE_CLASS,
  DATE_PICKER_SIZE_CLASS,
  DATE_PICKER_STATUS_BORDER_CLASS,
} from "../../../styles/calendar";
