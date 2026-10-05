/**
 * Link component configuration for AsheeUI.
 * This file registers the values the Link component defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the types that name them, live in `@asheeui/core`:
 * they are the framework's link contract rather than a web renderer's, and the native
 * renderer reads the same ones from the same place.
 */

import { type LinkConfig, registerComponentDefaults } from "@asheeui/core";

export type { LinkConfig, LinkUnderline, LinkVariant } from "@asheeui/core";

/**
 * Default config values registered for the Link component.
 */
export const defaultLinkConfig: LinkConfig = {
  size: "md",
  underline: "hover",
  isExternal: false,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_LINK_CONFIG = {
  size: "md",
  variant: "default",
  color: "primary",
  underline: "hover",
  isExternal: false,
} as const;

registerComponentDefaults("link", defaultLinkConfig);
