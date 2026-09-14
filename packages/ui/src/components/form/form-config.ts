/**
 * Form component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Form
 * component and registers them with the component registry, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";

/**
 * Theme configuration options for the Form component.
 *
 * Set under `components.form` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 *
 * The form element itself carries no visual treatment: it is a grouping and
 * submission element, and the fields inside it style themselves. These options
 * describe the submit control the component renders when a label is given for
 * it.
 */
export interface FormConfig {
  /**
   * Visual style variant of the submit control.
   *
   * @default "solid"
   */
  submitVariant?: Variant;

  /**
   * Theme accent colour of the submit control.
   *
   * @default "primary"
   */
  submitColor?: Color;

  /**
   * Size of the submit control.
   *
   * @default "md"
   */
  submitSize?: Size;

  /**
   * Corner rounding of the submit control.
   *
   * @default "md"
   */
  submitRadius?: Radius;
}

/**
 * Default config values registered for the Form component.
 *
 * The visual tokens are intentionally absent so they inherit from the global
 * defaults and the built-in fallback.
 */
export const defaultFormConfig: FormConfig = {
  submitRadius: "md",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_FORM_CONFIG: Required<FormConfig> = {
  submitVariant: "solid",
  submitColor: "primary",
  submitSize: "md",
  submitRadius: "md",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    form: FormConfig;
  }
}

registerComponentDefaults("form", defaultFormConfig);
