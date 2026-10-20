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
import { registerNativeComponentDefaults } from "../../../config/registry";

export type { EmptyStateConfig } from "@asheeui/core";

/**
 * Configuration options for the native EmptyState.
 */
export type NativeEmptyStateConfig = EmptyStateConfig;

/**
 * The defaults the EmptyState registers with the native registry.
 *
 * `role` is registered as `"none"`: a state that is part of the screen's first
 * markup is not a change, and announcing it would describe something that never
 * happened. The decision is the same one the web state makes, so the two platforms
 * read one configuration.
 */
export const defaultNativeEmptyStateConfig: NativeEmptyStateConfig = {
  type: "info",
  size: "md",
  panel: false,
  role: "none",
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    emptystate: NativeEmptyStateConfig;
  }
}

registerNativeComponentDefaults("emptystate", defaultNativeEmptyStateConfig);

/**
 * The values the state falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_EMPTY_STATE_CONFIG = {
  type: "info",
  size: "md",
  panel: false,
  role: "none",
} satisfies NativeEmptyStateConfig;
