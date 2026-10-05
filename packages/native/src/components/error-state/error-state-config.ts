/**
 * ErrorState configuration for the native package.
 *
 * The options are the ones the framework's failed-region contract names, so
 * `components.errorstate` is configured the same way on both platforms, and the type
 * is re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the platform, and the registration
 * that puts it in the native registry.
 */

import type { ErrorStateConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type { ErrorStateConfig, ErrorStateRole } from "@asheeui/core";

/**
 * Configuration options for the native ErrorState.
 */
export type NativeErrorStateConfig = ErrorStateConfig;

/**
 * The defaults the ErrorState registers with the native registry.
 *
 * A panel and an announcement are the defaults because this state usually replaces a
 * region after a request failed.
 */
export const defaultNativeErrorStateConfig: NativeErrorStateConfig = {
  size: "md",
  panel: true,
  role: "alert",
  retryLabel: "Try again",
  detailLabel: "Technical details",
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    errorstate: NativeErrorStateConfig;
  }
}

registerNativeComponentDefaults("errorstate", defaultNativeErrorStateConfig);

/**
 * The values the state falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_ERROR_STATE_CONFIG: Required<NativeErrorStateConfig> =
  {
    size: "md",
    panel: true,
    role: "alert",
    retryLabel: "Try again",
    detailLabel: "Technical details",
  };
