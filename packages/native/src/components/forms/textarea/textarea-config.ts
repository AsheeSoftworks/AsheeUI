/**
 * Textarea configuration for the native package.
 *
 * The options are the ones the field family names, so a multi-line field on native and
 * a multi-line field on the web are configured the same way. The five family axes are
 * taken from the family's own configuration rather than restated, and `rows` carries
 * the meaning the shared contract gives it: the renderer turns it into the minimum
 * height a platform field starts from.
 *
 * `labelAlign` and `fullWidth` are part of the section as of B12: the field shell draws
 * the alignment and the field wrapper states the width, so the options are honoured
 * rather than advertised.
 */

import type { FieldConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

/**
 * Configuration options for the native Textarea.
 *
 * `size`, `radius`, `variant`, `color`, `status`, `labelAlign` and `fullWidth` carry the
 * meanings the shared field family gives them.
 */
export interface NativeTextareaConfig
  extends Pick<
    FieldConfig,
    | "size"
    | "radius"
    | "variant"
    | "color"
    | "status"
    | "labelAlign"
    | "fullWidth"
  > {
  /** How many rows of text are visible at once. Defaults to 4. */
  rows?: number;

  /** Whether the field is unavailable. Defaults to false. */
  isDisabled?: boolean;

  /** Whether the field must be filled in before the form is submitted. Defaults to false. */
  required?: boolean;
}

/**
 * The defaults the Textarea registers with the native registry.
 * The density is the shared `md` whose proportions the native scale makes touch-sized,
 * and four rows is the height a value of a few sentences reads at without scrolling.
 *
 * @deprecated Use {@link defaultTextareaConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeTextareaConfig: NativeTextareaConfig = {
  size: "md",
  variant: "bordered",
  rows: 4,
  isDisabled: false,
  required: false,
  labelAlign: "left",
  fullWidth: true,
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    textarea: NativeTextareaConfig;
  }
}

registerNativeComponentDefaults("textarea", defaultNativeTextareaConfig);

/**
 * The values the field falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_TEXTAREA_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_TEXTAREA_CONFIG = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  rows: 4,
  isDisabled: false,
  required: false,
  labelAlign: "left",
  fullWidth: true,
} satisfies NativeTextareaConfig;
