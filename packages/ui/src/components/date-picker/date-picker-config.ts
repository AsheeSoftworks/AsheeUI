/**
 * DatePicker component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the DatePicker
 * component, including mode, size, and field configuration options.
 * It extends the FieldConfig for label handling and registers defaults
 * with the component registry.
 */

import { registerComponentDefaults } from "../../libs/registry";
import {
  defaultFieldConfig,
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

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
export interface DatePickerConfig extends FieldConfig {
  /**
   * The selection mode of the picker.
   * Controls whether the picker shows date, time, or both.
   *
   * @default "date"
   */
  mode?: PickerMode;

  /**
   * Whether to render the calendar popover in a React portal.
   * When true, the popover is rendered at the document body level,
   * escaping any parent DOM hierarchy. This prevents CSS containment
   * and stacking context issues. Defaults to true because popovers
   * should always appear above other content.
   *
   * @default true
   */
  portal?: boolean;

  /**
   * Custom portal target element for the calendar popover.
   * When portal is enabled, the popover is rendered into this element.
   * Defaults to document.body.
   */
  portalTarget?: HTMLElement | null;
}

/**
 * Default config values registered for the DatePicker component.
 * Inherits field label defaults and sets the default mode to "date".
 */
export const defaultDatePickerConfig: DatePickerConfig = {
  ...defaultFieldConfig,
  mode: "date",
  portal: true,
  portalTarget: null,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_DATE_PICKER_CONFIG: Required<DatePickerConfig> = {
  ...FALLBACK_FIELD_CONFIG,
  mode: "date",
  portal: true,
  portalTarget: null,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    datePicker: DatePickerConfig;
  }
}

registerComponentDefaults("datePicker", defaultDatePickerConfig);
