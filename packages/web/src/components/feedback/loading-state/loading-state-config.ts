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
 *
 * The registered claim (`md`) is a step above the room the registered density
 * (`md`) already takes, so the floor binds: a `sm` claim would sit under the
 * padding and the indicator and would reserve nothing at all.
 */
export const defaultLoadingStateConfig: LoadingStateConfig = {
  label: "Loading",
  size: "md",
  panel: false,
  minHeight: "md",
};

registerComponentDefaults("loadingstate", defaultLoadingStateConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_LOADING_STATE_CONFIG = {
  label: "Loading",
  size: "md",
  panel: false,
  minHeight: "md",
} satisfies LoadingStateConfig;
