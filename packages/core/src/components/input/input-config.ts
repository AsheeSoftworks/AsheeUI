/**
 * The Input's configuration face, shared by both platforms.
 *
 * An input is the field family's plainest member, so its configuration is the
 * family's: the same density, rounding, treatment, accent, label alignment and
 * validation status, under the component's own key. It extends `FieldConfig` rather
 * than restating it, which is what keeps `components.input` from drifting away from
 * `components.field` one option at a time.
 *
 * What an input adds to the family is behaviour rather than configuration — a
 * consumer reads and writes a string — and that part of the contract is stated once
 * in `../../contracts`, including the name of the handler both platforms report a
 * change through.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `input` here is what makes `components.input` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { FieldConfig } from "../field/field-config";

/**
 * Theme configuration options for the Input component.
 * Set under `components.input` in the AsheeUI config.
 */
export interface InputConfig extends FieldConfig {}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    input: InputConfig;
  }
}
