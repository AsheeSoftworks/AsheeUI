/**
 * The Switch's configuration face, shared by both platforms.
 *
 * A switch is a field that holds a boolean, so its configuration is the family's:
 * the same density, rounding, treatment, accent and validation status, under the
 * component's own key. It extends `FieldConfig` rather than restating it, which is
 * what keeps `components.switch` from drifting away from `components.field` one
 * option at a time.
 *
 * What a switch adds to the family is behaviour rather than configuration — the
 * value it holds is a boolean a consumer reads and writes — so the contract stays
 * as small as the field's.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `switch` here is what makes `components.switch` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import {
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

/**
 * Density of a switch, named as the family names it.
 *
 * It is the shared `FieldSizeKey` under the name the component uses, so a switch's
 * `size` prop reads as its own scale rather than as a generic token.
 */
export type SwitchSizeKey = FieldSizeKey;

/**
 * Theme configuration options for the Switch component.
 * Set under `components.switch` in the AsheeUI config.
 */
export interface SwitchConfig extends FieldConfig {}

/**
 * The values a switch falls back to when no tier provides one.
 */
export const FALLBACK_SWITCH_CONFIG: Required<SwitchConfig> = {
  ...FALLBACK_FIELD_CONFIG,
};

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    switch: SwitchConfig;
  }
}
