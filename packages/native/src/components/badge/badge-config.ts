/**
 * Badge component configuration for the native package.
 *
 * The options are the ones the framework's badge contract names, with native defaults:
 * a badge beside a thumb is read at arm's length, so the native scale starts one step
 * higher than the web's.
 */

import type { BadgeConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Badge.
 *
 * The axes are the shared ones, so `components.badge` is configured the same way on
 * both platforms. Nothing is added or dropped here: unlike the Button, whose press
 * animation belongs to the platform's own `Pressable`, a badge has no option that is
 * one platform's alone, so the native type is the shared one rather than a narrowing
 * of it.
 */
export type NativeBadgeConfig = BadgeConfig;

/**
 * The defaults the Badge registers with the native registry.
 *
 * `color` and `radius` are deliberately absent so they inherit from the platform's
 * configuration. `variant` is not, and that is the one place the two platforms'
 * registered defaults differ: a native surface's platform default treatment is the
 * filled `solid` that suits a button, and a status label that shouts by default is a
 * defect rather than a style choice, so the badge pins the low-emphasis treatment
 * instead. A consumer's own configuration still outranks it.
 */
export const defaultNativeBadgeConfig: NativeBadgeConfig = {
  variant: "faded",
  size: "sm",
  radius: "full",
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    badge: NativeBadgeConfig;
  }
}

registerNativeComponentDefaults("badge", defaultNativeBadgeConfig);

/**
 * The values the badge falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_BADGE_CONFIG: Required<NativeBadgeConfig> = {
  variant: "faded",
  color: "primary",
  size: "sm",
  radius: "full",
};
