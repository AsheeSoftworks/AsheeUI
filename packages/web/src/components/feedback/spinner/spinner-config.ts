/**
 * Spinner configuration for the web renderer.
 *
 * The options are the ones the framework's spinner contract names, so
 * `components.spinner` is configured the same way in both packages, and the type is
 * re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the web, and the registration that
 * puts it in the component registry, because a default is a platform property.
 */

import {
  registerComponentDefaults,
  SPINNER_FALLBACK_SPEED,
  type SpinnerConfig,
} from "@asheeui/core";

export type { SpinnerConfig } from "@asheeui/core";
export { SPINNER_FALLBACK_SPEED } from "@asheeui/core";

/**
 * Default config values registered for the Spinner component.
 *
 * `color` is intentionally absent so it inherits from the global `defaultColor`. The
 * speed is the framework's own, so a consumer who changes it changes what both
 * renderers do rather than what the web does.
 */
export const defaultSpinnerConfig: SpinnerConfig = {
  size: "md",
  speed: SPINNER_FALLBACK_SPEED,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_SPINNER_CONFIG: Required<SpinnerConfig> = {
  size: "md",
  color: "primary",
  speed: SPINNER_FALLBACK_SPEED,
  className: "",
};

registerComponentDefaults("spinner", defaultSpinnerConfig);
