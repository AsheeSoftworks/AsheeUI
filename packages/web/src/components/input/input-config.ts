/**
 * Input configuration for the web renderer.
 *
 * The input's options are the field family's, so the contract lives in
 * `@asheeui/core` and is re-exported here: a consumer configures `components.input`
 * with the same keys on both platforms, and the component reads the same shape its
 * native counterpart does.
 *
 * What stays with the renderer is the values registered as the web's defaults, since a
 * default is a platform property, and the registration itself.
 */

import { type InputConfig, registerComponentDefaults } from "@asheeui/core";
import { defaultFieldConfig } from "../field/field-config";

export type { InputConfig } from "@asheeui/core";

/**
 * The values the web's Input registers as its component defaults.
 *
 * An input is the field family's plainest member, so it registers the family's web
 * defaults rather than a second copy of them: a consumer who configures
 * `components.field` finds the same values under `components.input`.
 */
export const defaultInputConfig: InputConfig = defaultFieldConfig;

registerComponentDefaults("input", defaultInputConfig);
