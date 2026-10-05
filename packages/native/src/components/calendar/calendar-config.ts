/**
 * Calendar configuration for the native package.
 *
 * The options are the ones the framework's calendar names, so a date field on native and a
 * date field on the web are configured the same way. The family's axes and the one decision
 * only a calendar has — what the field collects — are taken from the shared configuration
 * rather than restated, and what follows is native's own: the platform names the
 * unavailable state itself.
 *
 * The web's calendar also takes a `picker` option, which configures the panel it floats
 * beside the input. It is deliberately absent here, because the platform has no floating
 * layer: the month is one surface at a time, and the option would describe something the
 * platform cannot show.
 */

import type { CalendarConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Calendar.
 *
 * `size`, `radius`, `variant`, `color` and `status` carry the meanings the shared field
 * family gives them, and `mode` carries the meaning the shared calendar gives it.
 */
export interface NativeCalendarConfig
  extends Pick<
    CalendarConfig,
    "size" | "radius" | "variant" | "color" | "status" | "mode"
  > {
  /** Whether the field is unavailable. Defaults to false. */
  isDisabled?: boolean;

  /** Whether the field must be answered before the form is submitted. Defaults to false. */
  required?: boolean;
}

/**
 * The defaults the Calendar registers with the native registry.
 *
 * The density is the shared `md` whose proportions the native scale makes touch-sized:
 * a day the reader cannot press is not a field they can fill in.
 */
export const defaultNativeCalendarConfig: NativeCalendarConfig = {
  size: "md",
  variant: "bordered",
  mode: "date",
  isDisabled: false,
  required: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    calendar: NativeCalendarConfig;
  }
}

registerNativeComponentDefaults("calendar", defaultNativeCalendarConfig);

/**
 * The values the date field falls back to when no tier provides one.
 * The family's fallbacks with the calendar's own mode beside them: a date field.
 */
export const FALLBACK_NATIVE_CALENDAR_CONFIG: Required<NativeCalendarConfig> = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  mode: "date",
  isDisabled: false,
  required: false,
};
