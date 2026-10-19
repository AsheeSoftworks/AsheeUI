/**
 * ErrorState component configuration for AsheeUI.
 * This file registers the values the failed-region presentation defaults to on the
 * web, so the component-level tier of the theme cascade has a value to resolve.
 * The options themselves, and the types that name them, live in `@asheeui/core`:
 * they are the framework's failed-region contract rather than a web renderer's, and
 * the native renderer reads the same ones from the same place.
 */

import {
  type ErrorStateConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type { ErrorStateConfig, ErrorStateRole } from "@asheeui/core";

/**
 * Default config values registered for the ErrorState component.
 * A panel and an announcement are the defaults because this state usually
 * replaces a region after a request failed.
 */
export const defaultErrorStateConfig: ErrorStateConfig = {
  size: "md",
  panel: true,
  role: "alert",
  retryLabel: "Try again",
  detailLabel: "Technical details",
};

registerComponentDefaults("errorstate", defaultErrorStateConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_ERROR_STATE_CONFIG: Required<ErrorStateConfig> = {
  size: "md",
  panel: true,
  role: "alert",
  retryLabel: "Try again",
  detailLabel: "Technical details",
};
