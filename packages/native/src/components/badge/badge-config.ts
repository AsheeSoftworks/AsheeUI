/**
 * Badge component configuration for the native package.
 *
 * The options are the ones the framework's badge contract names: a compact
 * status label with the shared treatment, colour, density and radius axes.
 */

import type { ColorRole, Radius, Size, Variant } from "@asheeui/shared";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Badge.
 */
export interface NativeBadgeConfig {
  /** Visual treatment. Defaults to "faded". */
  variant?: Variant;

  /** Colour role. Defaults to "primary". */
  color?: ColorRole;

  /** Density. Defaults to "sm". */
  size?: Size;

  /** Corner rounding. Defaults to "full". */
  radius?: Radius;
}

/**
 * The defaults the Badge registers with the native registry.
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
