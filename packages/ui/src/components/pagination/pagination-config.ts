/**
 * Pagination component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Pagination
 * component and registers them with the component registry, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";

/**
 * Theme configuration options for the Pagination component.
 *
 * Set under `components.pagination` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface PaginationConfig {
  /**
   * Size of the page controls.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Visual style variant of the page controls.
   *
   * @default "bordered"
   */
  variant?: Variant;

  /**
   * Theme accent colour of the page controls.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Corner rounding of the page controls.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * How many pages to show on each side of the current page.
   * A wider range shows more of the collection at once; a narrower range keeps
   * the trail short.
   *
   * @default 1
   */
  siblingCount?: number;

  /**
   * Whether the trail offers controls for the first and last page.
   *
   * @default false
   */
  showEdges?: boolean;
}

/**
 * Default config values registered for the Pagination component.
 *
 * `variant` and `color` are intentionally absent so they inherit from the
 * global `defaultVariant` and `defaultColor`.
 */
export const defaultPaginationConfig: PaginationConfig = {
  size: "md",
  radius: "md",
  siblingCount: 1,
  showEdges: false,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_PAGINATION_CONFIG: Required<PaginationConfig> = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "md",
  siblingCount: 1,
  showEdges: false,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    pagination: PaginationConfig;
  }
}

registerComponentDefaults("pagination", defaultPaginationConfig);
