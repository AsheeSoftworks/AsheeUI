/**
 * Checkbox configuration for the web renderer.
 *
 * The checkbox's options are the field family's, so the contract lives in
 * `@asheeui/core` and is re-exported here: a consumer configures
 * `components.checkbox` with the same keys on both platforms, and the component
 * reads the same shape its native counterpart does.
 *
 * What stays with the renderer is the value each option defaults to on the web —
 * a checkbox keeps square corners (`sm`) rather than inheriting the application's
 * radius — and the registration itself.
 */

import { type CheckboxConfig, registerComponentDefaults } from "@asheeui/core";
import { defaultFieldConfig } from "../field/field-config";

export type { CheckboxConfig, CheckboxSizeKey } from "@asheeui/core";
export { FALLBACK_CHECKBOX_CONFIG } from "@asheeui/core";

/**
 * The values the web's Checkbox registers as its component defaults.
 *
 * The radius is registered rather than inherited: a checkbox is a square a reader
 * ticks, and a pill-shaped checkbox would read as a strange switch. An
 * application that wants another rounding states `components.checkbox.radius` or
 * the instance prop.
 */
export const defaultCheckboxConfig: CheckboxConfig = {
  ...defaultFieldConfig,
  radius: "sm",
};

registerComponentDefaults("checkbox", defaultCheckboxConfig);
