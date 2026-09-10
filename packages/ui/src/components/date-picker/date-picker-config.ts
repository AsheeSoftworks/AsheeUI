/**
 * DatePicker component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the DatePicker
 * component, including mode, size, and field configuration options.
 * It extends the FieldConfig for label handling and registers defaults
 * with the component registry.
 */

import { registerComponentDefaults } from "../../libs/registry";
import {
  FALLBACK_FIELD_CONFIG,
  type FieldSizeKey,
} from "../field/field-config";
import { defaultInputConfig, type InputConfig } from "../input";

/**
 * The selection mode of the date picker.
 * - `date`: Select only a date.
 * - `time`: Select only a time.
 * - `datetime`: Select both date and time.
 */
export type PickerMode = "date" | "time" | "datetime";

/**
 * Size key for the date picker.
 * Maps to the FieldSizeKey type: "sm", "md", or "lg".
 */
export type DatePickerSizeKey = FieldSizeKey;

/**
 * Theme configuration options for the DatePicker component.
 *
 * Set under `components.datePicker` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface DatePickerConfig extends InputConfig {
  /**
   * The selection mode of the picker.
   * Controls whether the picker shows date, time, or both.
   *
   * @default "date"
   */
  mode?: PickerMode;

  /**
   * Picker configuration for the calendar popover.
   * Controls portal behavior and other picker-specific settings.
   */
  picker?: PickerConfig;
}

/**
 * Picker configuration for the DatePicker component.
 * Extends DatePickerConfig to allow override of portal settings.
 */
export interface PickerConfig {
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
 * Default config values registered for the DatePicker component.
 * Inherits field label defaults and sets the default mode to "date".
 */
export const defaultDatePickerConfig: DatePickerConfig = {
  ...defaultInputConfig,
  mode: "date",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_DATE_PICKER_CONFIG = {
  ...FALLBACK_FIELD_CONFIG,
  mode: "date",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    datePicker: DatePickerConfig;
  }
}

registerComponentDefaults("datePicker", defaultDatePickerConfig);
