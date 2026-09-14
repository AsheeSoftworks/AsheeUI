/**
 * Breadcrumb component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Breadcrumb
 * component and registers them with the component registry, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Size } from "../../shared";

/**
 * Theme configuration options for the Breadcrumb component.
 *
 * Set under `components.breadcrumb` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface BreadcrumbConfig {
  /**
   * Text and spacing scale of the trail.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Theme accent colour of the links in the trail.
   * The current location is presented in the foreground colour instead.
   *
   * @default "primary"
   */
  color?: Color;
}

/**
 * Default config values registered for the Breadcrumb component.
 *
 * `color` is intentionally absent so it inherits from the global
 * `defaultColor`.
 */
export const defaultBreadcrumbConfig: BreadcrumbConfig = {
  size: "md",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_BREADCRUMB_CONFIG: Required<BreadcrumbConfig> = {
  size: "md",
  color: "primary",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    breadcrumb: BreadcrumbConfig;
  }
}

registerComponentDefaults("breadcrumb", defaultBreadcrumbConfig);
