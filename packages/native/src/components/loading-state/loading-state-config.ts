/**
 * LoadingState configuration for the native package.
 *
 * The options are the ones the framework's loading-region contract names, so
 * `components.loadingstate` is configured the same way on both platforms, and the
 * type is re-exported from `@asheeui/core` rather than restated here. What stays with
 * the renderer is the value each option defaults to on the platform, and the
 * registration that puts it in the native registry.
 */

import type { LoadingStateConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type { LoadingStateConfig } from "@asheeui/core";

/**
 * Configuration options for the native LoadingState.
 */
export type NativeLoadingStateConfig = LoadingStateConfig;

/**
 * The defaults the LoadingState registers with the native registry.
 */
export const defaultNativeLoadingStateConfig: NativeLoadingStateConfig = {
  label: "Loading",
  size: "md",
  panel: false,
  minHeight: "sm",
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    loadingstate: NativeLoadingStateConfig;
  }
}

registerNativeComponentDefaults(
  "loadingstate",
  defaultNativeLoadingStateConfig,
);

/**
 * The values the state falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_LOADING_STATE_CONFIG: Required<NativeLoadingStateConfig> =
  {
    label: "Loading",
    size: "md",
    panel: false,
    minHeight: "sm",
  };
