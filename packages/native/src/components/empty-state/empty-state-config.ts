/**
 * EmptyState configuration for the native package.
 *
 * The options are the ones the framework's empty-region contract names, so
 * `components.emptystate` is configured the same way on both platforms, and the type
 * is re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the platform, and the registration
 * that puts it in the native registry.
 */

import type { EmptyStateConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type { EmptyStateConfig } from "@asheeui/core";

/**
 * Configuration options for the native EmptyState.
 */
export type NativeEmptyStateConfig = EmptyStateConfig;

/**
 * The defaults the EmptyState registers with the native registry.
 */
export const defaultNativeEmptyStateConfig: NativeEmptyStateConfig = {
  type: "info",
  size: "md",
  panel: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    emptystate: NativeEmptyStateConfig;
  }
}

registerNativeComponentDefaults("emptystate", defaultNativeEmptyStateConfig);

/**
 * The values the state falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_EMPTY_STATE_CONFIG: Required<NativeEmptyStateConfig> =
  {
    type: "info",
    size: "md",
    panel: false,
  };
