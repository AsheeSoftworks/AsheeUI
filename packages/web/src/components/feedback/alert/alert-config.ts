/**
 * Alert component configuration for AsheeUI.
 * This file registers the values the Alert component defaults to on the web, so
 * the component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the type that names them, live in `@asheeui/core`:
 * they are the framework's alert contract rather than a web renderer's, and the
 * native renderer reads the same ones from the same place.
 */

import { type AlertConfig, registerComponentDefaults } from "@asheeui/core";

export type { AlertConfig, AlertType } from "@asheeui/core";

/**
 * Default config values registered for the Alert component.
 *
 * `variant` is intentionally absent so it inherits from the global
 * `defaultVariant`. `radius` is registered, so it is pinned: the component tier
 * answers before the application's `defaultRadius`, which therefore never reaches
 * an alert. State `components.alert.radius` or the instance prop instead.
 */
export const defaultAlertConfig: AlertConfig = {
  type: "info",
  radius: "md",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_ALERT_CONFIG = {
  type: "info",
  variant: "faded",
  radius: "md",
} as const satisfies AlertConfig;

registerComponentDefaults("alert", defaultAlertConfig);
