/**
 * The Textarea's configuration face, shared by both platforms.
 *
 * A textarea is the field family's member for a value that does not fit on one line,
 * so its configuration is the family's — density, rounding, treatment, accent, label
 * alignment and validation status — plus the one thing a multi-line field has that a
 * single-line one does not: how much text is visible at once.
 *
 * It extends `FieldConfig` rather than restating it, which is what keeps
 * `components.textarea` from drifting away from `components.field` one option at a
 * time. What a renderer keeps for itself is the value `rows` *means*: the web hands it
 * to the browser as a row count, and native turns it into a minimum height, because the
 * platform's control grows with its content and has no rows of its own.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `textarea` here is what makes `components.textarea` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import { FALLBACK_FIELD_CONFIG, type FieldConfig } from "../field/field-config";

/**
 * Theme configuration options for the Textarea component.
 * Set under `components.textarea` in the AsheeUI config.
 */
export interface TextAreaConfig extends FieldConfig {
  /**
   * How much of the value is visible at once.
   *
   * The web states it as the number of visible text rows; native reads the same option
   * as a height its control starts from, because the platform sizes a text field by
   * its content rather than by a row count.
   *
   * @default 4
   */
  rows?: number;
}

/**
 * The values a textarea falls back to when no tier provides one.
 */
export const FALLBACK_TEXTAREA_CONFIG: Required<TextAreaConfig> = {
  ...FALLBACK_FIELD_CONFIG,
  rows: 4,
};

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    textarea: TextAreaConfig;
  }
}
