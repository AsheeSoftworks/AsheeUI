/**
 * Calendar configuration for the web renderer.
 *
 * A calendar's options are the field family's plus the one decision only a calendar has —
 * what it collects — so that part of the contract lives in `@asheeui/core` and is re-exported
 * here: a consumer configures `components.calendar` with the same keys on both platforms, and
 * the component reads the same shape its native counterpart does.
 *
 * What stays with the renderer is the panel its field opens. The web floats one beside the
 * input, where a pointer can leave the field and reach it, so it is the web that can say
 * whether that panel is rendered through a portal, which element it is portalled into, and
 * whether the page behind it scrolls. It also stays with the renderer that the configuration
 * *section* is declared: a calendar on the platform has no floating panel to configure, and a
 * section that named one would name something the platform does not have.
 */

import {
  FALLBACK_CALENDAR_CONFIG,
  registerComponentDefaults,
  type CalendarConfig as SharedCalendarConfig,
} from "@asheeui/core";
import { defaultInputConfig } from "../input";

export type { CalendarMode, CalendarSizeKey } from "@asheeui/core";

/**
 * Picker configuration for the Calendar component.
 * Controls the floating panel the field opens, rather than what the field collects.
 */
export interface CalendarPickerConfig {
  /**
   * Whether to render the calendar popover through Floating UI's
   * `FloatingPortal`.
   * When true, the popover is rendered at the document body level,
   * escaping any parent DOM hierarchy. This prevents CSS containment
   * and stacking context issues. Defaults to true because popovers
   * should always appear above other content.
   *
   * @default true
   * @see FloatingPortal - https://floating-ui.com/docs/FloatingPortal
   */
  portal?: boolean;

  /**
   * Custom portal target element for the calendar popover.
   * When portal is enabled, the popover is rendered into this element.
   * Defaults to document.body.
   */
  portalTarget?: HTMLElement | null;

  /**
   * Whether to lock page scroll while the calendar popover is open.
   * When true, the page behind the popover cannot scroll. Uses
   * scroll-position-compensated `position: fixed` on `<body>` so locking
   * does not jump the page back to the top.
   *
   * @default true
   */
  lockScroll?: boolean;
}

/**
 * Theme configuration options for the Calendar component.
 *
 * Set under `components.calendar` in the AsheeUI config. The shared options carry the
 * meanings the field family gives them; the `picker` key is the web's own.
 */
export interface CalendarConfig extends SharedCalendarConfig {
  /**
   * Picker configuration for the calendar popover.
   * Controls portal behavior and other picker-specific settings.
   */
  picker?: CalendarPickerConfig;
}

/**
 * Default config values registered for the Calendar component.
 * Inherits field label defaults and sets the default mode to "date".
 */
export const defaultCalendarConfig: CalendarConfig = {
  ...defaultInputConfig,
  mode: "date",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_DATE_PICKER_CONFIG = FALLBACK_CALENDAR_CONFIG;

declare module "@asheeui/core" {
  interface ComponentTypeConfigRegistry {
    calendar: CalendarConfig;
  }
}

registerComponentDefaults("calendar", defaultCalendarConfig);
