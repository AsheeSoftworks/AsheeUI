/**
 * Field configuration for the web renderer.
 *
 * The option names, the values they accept and what a field means by them are the
 * family's rather than the platform's, so they live in `@asheeui/core` and are
 * re-exported here. A component in this package that reads `../field/field-config`
 * keeps reading one module, and what it finds there is the same vocabulary the native
 * package compiles — including the two rules the family states once, `isFieldInvalid`
 * and `resolveFieldStatusColor`.
 *
 * What stays with the renderer is the value each option *defaults to* on the web, and
 * the act of registering it: a default is a platform property, and the registry it is
 * registered into is the consumer's configuration pipeline.
 */

import { type FieldConfig, registerComponentDefaults } from "@asheeui/core";

export type {
  FieldConfig,
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "@asheeui/core";

export {
  FALLBACK_FIELD_CONFIG,
  isFieldInvalid,
  resolveFieldStatusColor,
} from "@asheeui/core";

/**
 * The values the web's field components register as their component defaults.
 *
 * Set under `components.field` in the AsheeUI config. `radius`, `color` and `status`
 * are absent deliberately: they inherit the consumer's platform configuration and the
 * family's fallback, so a web field follows the application's default radius rather
 * than pinning one.
 */
export const defaultFieldConfig: FieldConfig = {
  size: "md",
  labelAlign: "left",
  fullWidth: false,
  variant: "bordered",
};

registerComponentDefaults("field", defaultFieldConfig);
