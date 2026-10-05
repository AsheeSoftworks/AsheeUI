/**
 * Form configuration for the native package.
 *
 * The options are the ones the framework's form names, so the submit control a form renders on
 * native and on the web are configured the same way. Every axis is taken from the shared
 * configuration rather than restated.
 *
 * The renderer keeps the values the options default to, and they are the web's: a form's
 * submit control is a button, and the button's own defaults are the platform's.
 */

import type { FormConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Form.
 *
 * `submitVariant`, `submitColor`, `submitSize` and `submitRadius` carry the meanings the
 * shared form gives them.
 */
export type NativeFormConfig = FormConfig;

/**
 * The defaults the Form registers with the native registry.
 * The visual tokens are absent deliberately so they inherit the application's own
 * configuration and the form's fallback, rather than pinning a button nobody chose.
 */
export const defaultNativeFormConfig: NativeFormConfig = {
  submitRadius: "md",
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    form: NativeFormConfig;
  }
}

registerNativeComponentDefaults("form", defaultNativeFormConfig);

/**
 * The values the form falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_FORM_CONFIG: Required<NativeFormConfig> = {
  submitVariant: "solid",
  submitColor: "primary",
  submitSize: "md",
  submitRadius: "md",
};
