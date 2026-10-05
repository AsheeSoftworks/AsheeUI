/**
 * LoadingState component configuration for AsheeUI.
 * This file registers the values the loading presentation defaults to on the web,
 * so the component-level tier of the theme cascade has a value to resolve.
 * The options themselves, and the type that names them, live in `@asheeui/core`:
 * they are the framework's loading-region contract rather than a web renderer's,
 * and the native renderer reads the same ones from the same place.
 */

import {
  type LoadingStateConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type { LoadingStateConfig } from "@asheeui/core";

/**
 * Default config values registered for the LoadingState component.
 */
export const defaultLoadingStateConfig: LoadingStateConfig = {
  label: "Loading",
  size: "md",
  panel: false,
  minHeight: "sm",
};

registerComponentDefaults("loadingstate", defaultLoadingStateConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_LOADING_STATE_CONFIG: Required<LoadingStateConfig> = {
  label: "Loading",
  size: "md",
  panel: false,
  minHeight: "sm",
};
