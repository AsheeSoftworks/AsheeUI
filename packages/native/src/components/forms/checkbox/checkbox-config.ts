/**
 * Checkbox configuration for the native package.
 *
 * The options are the ones the framework's field family names, so a checkbox on
 * native and a checkbox on the web are configured the same way. The four axes
 * native implements are taken from the family's own configuration rather than
 * restated, so a member that renames or retypes one cannot leave the checkbox
 * behind. What follows is native's own: the platform names the unavailable state
 * itself.
 *
 * The family axes native does not implement — `labelAlign` and `fullWidth` — are
 * absent deliberately, because a configuration that advertised them would offer
 * a consumer options the platform would ignore.
 */

import type { CheckboxConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

/**
 * Configuration options for the native Checkbox.
 *
 * `size`, `radius`, `color` and `status` carry the meanings the shared field
 * family gives them.
 *
 * @deprecated Use {@link CheckboxConfig} from `@asheeui/core` — the name both
 * renderers publish.
 */
export interface NativeCheckboxConfig
  extends Pick<CheckboxConfig, "size" | "radius" | "color" | "status"> {
  /** Whether the checkbox is unavailable. Defaults to false. */
  isDisabled?: boolean;
}

/**
 * The defaults the Checkbox registers with the native registry.
 *
 * The rounding is `sm`: a checkbox is a square a reader ticks, so it keeps a
 * square's corners rather than taking the family's default.
 *
 * @deprecated Use {@link defaultCheckboxConfig} — the name both renderers
 * publish. The value is this one: a fallback states the platform's default, and
 * the name is shared.
 */
export const defaultNativeCheckboxConfig: NativeCheckboxConfig = {
  size: "md",
  radius: "sm",
  isDisabled: false,
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    checkbox: NativeCheckboxConfig;
  }
}

registerNativeComponentDefaults("checkbox", defaultNativeCheckboxConfig);

/**
 * The values a checkbox falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_CHECKBOX_CONFIG} — the name both renderers
 * publish. The value is this one: a fallback states the platform's default, and
 * the name is shared.
 */
export const FALLBACK_NATIVE_CHECKBOX_CONFIG = {
  size: "md",
  radius: "sm",
  color: "primary",
  status: "default",
  isDisabled: false,
} satisfies NativeCheckboxConfig;
