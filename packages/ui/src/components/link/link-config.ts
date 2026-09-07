/**
 * Link component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Link
 * component, including variant, color, size, underline behavior, and
 * external link handling. It registers the default configuration with
 * the component registry and provides fallback values for the cascade
 * resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Size } from "../../shared";

/**
 * Visual style variant of the link.
 * - `default`: Standard link with color accent.
 * - `muted`: Subtle, lower-contrast link.
 * - `subtle`: Very low emphasis link with reduced opacity.
 */
export type LinkVariant = "default" | "muted" | "subtle";

/**
 * Underline behavior of the link.
 * - `always`: Always show underline.
 * - `hover`: Show underline only on hover.
 * - `never`: Never show underline.
 */
export type LinkUnderline = "always" | "hover" | "never";

/**
 * Theme configuration options for the Link component.
 *
 * Set under `components.link` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface LinkConfig {
  /**
   * Visual style variant.
   * Controls the emphasis level of the link.
   *
   * @default "default"
   */
  variant?: LinkVariant;

  /**
   * Theme accent color.
   * Controls the color of the link text.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Font size scale.
   * Controls the text size and spacing.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Underline behavior.
   * Controls when the underline is visible.
   *
   * @default "hover"
   */
  underline?: LinkUnderline;

  /**
   * Whether the link points to an external resource.
   * When true, adds an external link icon and appropriate rel attributes.
   *
   * @default false
   */
  isExternal?: boolean;
}

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

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    link: LinkConfig;
  }
}

registerComponentDefaults("link", defaultLinkConfig);
