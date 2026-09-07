/**
 * Field configuration types for AsheeUI form components.
 * This file defines the shared configuration options for form field components
 * like Input, Select, and DatePicker. It provides the FieldConfig interface
 * that components extend, along with default values and registry registration.
 * These types establish the common visual and behavioral properties that
 * form fields share across the library.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";

/**
 * Size key for field components.
 * Maps to the standard Size type: "sm", "md", or "lg".
 */
export type FieldSizeKey = Size;

/**
 * Validation status of a field.
 * Controls visual feedback for different states.
 */
export type FieldStatus = "default" | "error" | "warning" | "success";

/**
 * Alignment of the label relative to the field.
 * Controls text alignment of the label element.
 */
export type LabelAlign = "left" | "center" | "right";

/**
 * Theme configuration options shared by form field components.
 *
 * Set under `components.field` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade. Individual
 * components may extend this interface with their own properties.
 */
export interface FieldConfig {
  /**
   * Size of the field.
   * Controls the height, padding, and font size.
   *
   * @default "md"
   */
  size?: FieldSizeKey;

  /**
   * Corner rounding of the field.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Visual style variant of the field.
   *
   * @default "bordered"
   */
  variant?: Variant;

  /**
   * Theme accent color of the field.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Alignment of the label relative to the field.
   *
   * @default "left"
   */
  labelAlign?: LabelAlign;

  /**
   * Whether the field should stretch to fill its parent width.
   *
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Validation status of the field.
   * Controls border color and message styling.
   *
   * @default "default"
   */
  status?: FieldStatus;
}

/**
 * Default config values registered for field components.
 * These values are used as the base defaults for all field components.
 */
export const defaultFieldConfig: FieldConfig = {
  size: "md",
  labelAlign: "left",
  fullWidth: false,
  variant: "bordered",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_FIELD_CONFIG: Required<FieldConfig> = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  labelAlign: "left",
  fullWidth: false,
  status: "default",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    field: FieldConfig;
  }
}

registerComponentDefaults("field", defaultFieldConfig);
