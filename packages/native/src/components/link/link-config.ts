/**
 * Link configuration for the native package.
 *
 * The options are the ones the framework's link contract names, so `components.link` is
 * configured the same way on both platforms, and the types are re-exported from
 * `@asheeui/core` rather than restated here. What stays with the renderer is the value
 * each option defaults to on the platform, and the registration that puts it in the
 * native registry.
 */

import type { LinkConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type { LinkConfig, LinkUnderline, LinkVariant } from "@asheeui/core";

/**
 * Configuration options for the native Link.
 */
export type NativeLinkConfig = LinkConfig;

/**
 * The defaults the Link registers with the native registry.
 */
export const defaultNativeLinkConfig: NativeLinkConfig = {
  size: "md",
  underline: "hover",
  isExternal: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    link: NativeLinkConfig;
  }
}

registerNativeComponentDefaults("link", defaultNativeLinkConfig);

/**
 * The values the link falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_LINK_CONFIG = {
  size: "md",
  variant: "default",
  color: "primary",
  underline: "hover",
  isExternal: false,
} as const;
