/**
 * Form configuration for the web renderer.
 *
 * The form's options are shared, so the contract lives in `@asheeui/core` and is re-exported
 * here: a consumer configures `components.form` with the same keys on both platforms.
 *
 * What stays with the renderer is the value each option *defaults to* on the web, and the
 * registration itself.
 */

import { type FormConfig, registerComponentDefaults } from "@asheeui/core";

export type { FormConfig } from "@asheeui/core";
export { FALLBACK_FORM_CONFIG } from "@asheeui/core";

/**
 * Default config values registered for the Form component.
 *
 * The visual tokens are intentionally absent so they inherit from the global defaults and the
 * built-in fallback.
 */
export const defaultFormConfig: FormConfig = {
  submitRadius: "md",
};

registerComponentDefaults("form", defaultFormConfig);
