/**
 * Input configuration for the native package.
 *
 * The options are the ones the framework's input contract names, so a text field on
 * native and a text field on the web are configured the same way. The density scale is
 * decided by touch, which is why the default is taller here than on the web.
 *
 * The five axes the family offers are taken from the family's own configuration rather
 * than restated, so a member of the family that renames or retypes one cannot leave the
 * input behind. The three options that follow are native's own: the platform has one
 * control for one line and for several, where the web has a field and a textarea
 * beside it, and it names the unavailable and the mandatory state itself.
 *
 * `labelAlign` and `fullWidth` were absent until B12, because a configuration that
 * advertised them would have offered options the platform ignored. B12 implements both
 * in the field shell, so they are part of the section now rather than a promise the
 * component did not keep.
 */

import type { FieldConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

/**
 * Configuration options for the native Input.
 *
 * `size`, `radius`, `variant`, `color`, `status`, `labelAlign` and `fullWidth` carry the
 * meanings the shared field contract gives them.
 *
 * @deprecated Use {@link InputConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export interface NativeInputConfig
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
  /** Whether the field accepts several lines. Defaults to false. */
  multiline?: boolean;

  /** Whether the field is unavailable. Defaults to false. */
  isDisabled?: boolean;

  /** Whether the field must be filled in before the form is submitted. Defaults to false. */
  required?: boolean;
}

/**
 * The defaults the Input registers with the native registry.
 * The density is `md`, which is the shared density whose height the native scale
 * makes touch-sized; `variant` and `color` stay unset so they inherit the
 * platform's configuration.
 *
 * @deprecated Use {@link defaultInputConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeInputConfig: NativeInputConfig = {
  size: "md",
  variant: "bordered",
  multiline: false,
  isDisabled: false,
  required: false,
  labelAlign: "left",
  fullWidth: true,
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    input: NativeInputConfig;
  }
}

registerNativeComponentDefaults("input", defaultNativeInputConfig);

/**
 * The values the field falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_INPUT_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_INPUT_CONFIG = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  multiline: false,
  isDisabled: false,
  required: false,
  labelAlign: "left",
  fullWidth: true,
} satisfies NativeInputConfig;
