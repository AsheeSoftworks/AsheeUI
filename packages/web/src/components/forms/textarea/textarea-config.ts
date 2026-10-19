/**
 * Textarea configuration for the web renderer.
 *
 * The textarea's options are the field family's, plus the one thing a multi-line field
 * has that a single-line one does not: how much of the value is visible at once. That
 * contract lives in `@asheeui/core` and is re-exported here, so a consumer configures
 * `components.textarea` with the same keys on both platforms.
 *
 * What stays with the renderer is the value each option *defaults to* on the web, and
 * the registration itself.
 */

import { registerComponentDefaults, type TextAreaConfig } from "@asheeui/core";
import { defaultFieldConfig } from "../field/field-config";

export type { TextAreaConfig } from "@asheeui/core";
export { FALLBACK_TEXTAREA_CONFIG } from "@asheeui/core";

/**
 * The values the web's Textarea registers as its component defaults.
 * It registers the family's web defaults rather than a second copy of them, and four
 * rows, which is the height a value of a few sentences reads at without scrolling.
 */
export const defaultTextAreaConfig: TextAreaConfig = {
  ...defaultFieldConfig,
  rows: 4,
};

registerComponentDefaults("textarea", defaultTextAreaConfig);
