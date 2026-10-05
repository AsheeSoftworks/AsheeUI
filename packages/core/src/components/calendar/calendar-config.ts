/**
 * The Calendar's configuration face, shared by both platforms.
 *
 * A calendar is a field family member whose value is a date rather than a string, so its
 * configuration is the family's axes plus the one decision only a calendar has: what the
 * field collects — a date, a time, or both. What a chosen day *means* is not a preference
 * and is therefore not here: the month grid, the display format and the two rules that
 * decide which cells a reader may reach live beside the classes in `./calendar-helpers`,
 * so both renderers read one answer.
 *
 * What a renderer keeps is the surface its field opens. The web floats a panel beside the
 * input, where a pointer can leave the field and reach it, and configures that panel under a
 * `picker` key; the platform has no floating layer and shows one surface at a time. That
 * difference is recorded in the compatibility matrix rather than offered as a configuration
 * option, because a preference cannot decide what a platform has, and it is why the
 * configuration *section* is declared by each renderer rather than here: a section that named
 * a floating panel would name something the platform does not have.
 *
 * The module registers nothing and imports no renderer.
 */

import {
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

/**
 * What a calendar field collects.
 *
 * - `date`: a day.
 * - `time`: a time of day, on whatever day the field already holds.
 * - `datetime`: both, which is the one mode whose surface has to show both at once.
 */
export type CalendarMode = "date" | "time" | "datetime";

/**
 * Density of the calendar field, named as the field family names it.
 *
 * The same union the family uses, under the name a calendar reads, so a calendar's `size`
 * says it is the field scale rather than a generic token.
 */
export type CalendarSizeKey = FieldSizeKey;

/**
 * Theme configuration options for the Calendar component.
 *
 * Set under `components.calendar` in the AsheeUI config. It extends `FieldConfig` rather
 * than restating it, which is what keeps `components.calendar` from drifting away from
 * `components.field` one option at a time.
 */
export interface CalendarConfig extends FieldConfig {
  /**
   * What the picker collects.
   *
   * @default "date"
   */
  mode?: CalendarMode;
}

/**
 * The values a calendar falls back to when no tier provides one.
 *
 * The family's fallbacks with the calendar's own mode beside them: a date field.
 */
export const FALLBACK_CALENDAR_CONFIG: Required<FieldConfig> & {
  mode: CalendarMode;
} = {
  ...FALLBACK_FIELD_CONFIG,
  mode: "date",
};
