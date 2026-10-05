/**
 * Alert configuration for the native package.
 *
 * The options are the ones the framework's alert contract names, so
 * `components.alert` is configured the same way on both platforms, and the type is
 * re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the platform, and the
 * registration that puts it in the native registry.
 *
 * `variant` is deliberately absent from the registered defaults so it inherits from
 * the platform's configuration rather than pinning a treatment, exactly as the web
 * alert leaves it.
 */

import type { AlertConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type { AlertConfig } from "@asheeui/core";

/**
 * Configuration options for the native Alert.
 */
export type NativeAlertConfig = AlertConfig;

/**
 * The defaults the Alert registers with the native registry.
 *
 * `variant` is pinned because an alert's documented default is a tinted surface:
 * leaving it out would let the platform's filled default turn every message into a
 * solid block, which is what the card pins its own treatment to avoid. `type` and
 * `radius` follow the component's documented defaults.
 */
export const defaultNativeAlertConfig: NativeAlertConfig = {
  type: "info",
  variant: "faded",
  radius: "md",
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    alert: NativeAlertConfig;
  }
}

registerNativeComponentDefaults("alert", defaultNativeAlertConfig);

/**
 * The values the alert falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_ALERT_CONFIG: Required<NativeAlertConfig> = {
  type: "info",
  variant: "faded",
  radius: "md",
};
