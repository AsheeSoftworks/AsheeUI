/**
 * The Form's configuration face, shared by both platforms.
 *
 * A form is the family's container rather than one of its members: it groups fields and
 * submits them, and the fields inside it style themselves. What it configures is therefore
 * the submit control it renders, which is a button.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `form` here is what makes `components.form` a known configuration
 * section, on every platform, without each renderer restating it.
 */

import type { Color, Variant } from "../../shared/variant";
import type { Radius, Size } from "../../tokens";

/**
 * Theme configuration options for the Form component.
 *
 * Set under `components.form` in the AsheeUI config.
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
 * The values a form falls back to when no tier provides one.
 */
export const FALLBACK_FORM_CONFIG: Required<FormConfig> = {
  submitVariant: "solid",
  submitColor: "primary",
  submitSize: "md",
  submitRadius: "md",
};

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    form: FormConfig;
  }
}
