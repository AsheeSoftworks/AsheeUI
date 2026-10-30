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
import { registerNativeComponentDefaults } from "../../../config/registry";

export type { LoadingStateConfig } from "@asheeui/core";

/**
 * Configuration options for the native LoadingState.
 *
 * @deprecated Use {@link LoadingStateConfig} from `@asheeui/core` — the name both
 * renderers publish. This spelling is the renderer's narrowing of the same contract.
 */
export type NativeLoadingStateConfig = LoadingStateConfig;

/**
 * The defaults the LoadingState registers with the native registry.
 *
 * The registered claim (`md`) is a step above the room the registered density
 * (`md`) already takes, so the floor binds: a `sm` claim would sit under the
 * padding and the indicator and would reserve nothing at all. It is the same
 * pairing the web state registers, so the region claims the same room on both
 * platforms.
 */
export const defaultNativeLoadingStateConfig: NativeLoadingStateConfig = {
  label: "Loading",
  size: "md",
  panel: false,
  minHeight: "md",
};

declare module "../../../config/registry" {
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
export const FALLBACK_NATIVE_LOADING_STATE_CONFIG = {
  label: "Loading",
  size: "md",
  panel: false,
  minHeight: "md",
} satisfies NativeLoadingStateConfig;
