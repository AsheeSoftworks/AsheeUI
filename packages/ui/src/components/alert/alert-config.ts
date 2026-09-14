/**
 * Alert component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Alert
 * component and registers them with the component registry, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Radius, Variant } from "../../shared";

/**
 * Intent of an alert.
 * Selects the colour an alert is presented in and how urgently it is
 * announced: `error` and `warning` interrupt, `info` and `success` wait for a
 * pause in what assistive technology is reading.
 */
export type AlertType = "success" | "error" | "info" | "warning";

/**
 * Theme configuration options for the Alert component.
 *
 * Set under `components.alert` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface AlertConfig {
  /**
   * Intent of the alert.
   * Controls its colour and how urgently its message is announced.
   *
   * @default "info"
   */
  type?: AlertType;

  /**
   * Visual style variant.
   * Controls the alert's background, border, and text treatment.
   *
   * @default "faded"
   */
  variant?: Exclude<Variant, "underlined">;

  /**
   * Corner rounding.
   * Controls the border-radius of the alert.
   *
   * @default "md"
   */
  radius?: Radius;
}

/**
 * Default config values registered for the Alert component.
 *
 * `variant` is intentionally absent so it inherits from the global
 * `defaultVariant`.
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
export const FALLBACK_ALERT_CONFIG: Required<AlertConfig> = {
  type: "info",
  variant: "faded",
  radius: "md",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    alert: AlertConfig;
  }
}

registerComponentDefaults("alert", defaultAlertConfig);
