/**
 * Textarea configuration for the native package.
 *
 * The options are the ones the field family names, so a multi-line field on native and
 * a multi-line field on the web are configured the same way. The five family axes are
 * taken from the family's own configuration rather than restated, and `rows` carries
 * the meaning the shared contract gives it: the renderer turns it into the minimum
 * height a platform field starts from.
 *
 * The family axes native does not implement — `labelAlign` and `fullWidth` — are
 * absent deliberately, because a configuration that advertised them would offer a
 * consumer options the platform would ignore.
 */

import type { FieldConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Textarea.
 *
 * `size`, `radius`, `variant`, `color` and `status` carry the meanings the shared field
 * family gives them.
 */
export interface NativeTextareaConfig
  extends Pick<
    FieldConfig,
    "size" | "radius" | "variant" | "color" | "status"
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
 */
export const defaultNativeTextareaConfig: NativeTextareaConfig = {
  size: "md",
  variant: "bordered",
  rows: 4,
  isDisabled: false,
  required: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    textarea: NativeTextareaConfig;
  }
}

registerNativeComponentDefaults("textarea", defaultNativeTextareaConfig);

/**
 * The values the field falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_TEXTAREA_CONFIG: Required<NativeTextareaConfig> = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  rows: 4,
  isDisabled: false,
  required: false,
};
