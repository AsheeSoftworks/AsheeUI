/**
 * The Checkbox's configuration face, shared by both platforms.
 *
 * A checkbox is a field that holds a boolean, so its configuration is the family's:
 * the same density, rounding, accent and validation status, under the component's
 * own key. It extends `FieldConfig` rather than restating it, which is what keeps
 * `components.checkbox` from drifting away from `components.field` one option at a
 * time.
 *
 * The same section configures a `Checkbox` and the `CheckboxGroup` it can sit in:
 * a group states the density, accent and validation status once, and every option
 * inherits them. What the group adds is behaviour — it holds a set of values rather
 * than one boolean — so the contract stays as small as the field's.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `checkbox` here is what makes `components.checkbox` a
 * known configuration section, on every platform, without each renderer restating
 * it.
 */

import {
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

/**
 * Density of a checkbox, named as the family names it.
 *
 * It is the shared `FieldSizeKey` under the name the component uses, so a
 * checkbox's `size` prop reads as its own scale rather than as a generic token.
 */
export type CheckboxSizeKey = FieldSizeKey;

/**
 * Theme configuration options for the Checkbox component.
 * Set under `components.checkbox` in the AsheeUI config.
 */
export interface CheckboxConfig extends FieldConfig {}

/**
 * The values a checkbox falls back to when no tier provides one.
 *
 * The rounding is `sm`: a checkbox is a square a reader ticks, so it keeps a
 * square's corners rather than taking the field family's `md` rounding. The
 * default is registered by each renderer, which is why it is also stated here —
 * a fallback and a registered default are the same value.
 */
export const FALLBACK_CHECKBOX_CONFIG = {
  ...FALLBACK_FIELD_CONFIG,
  radius: "sm",
} satisfies CheckboxConfig;

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    checkbox: CheckboxConfig;
  }
}
