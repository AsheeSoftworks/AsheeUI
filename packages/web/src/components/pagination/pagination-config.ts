/**
 * Pagination component configuration for AsheeUI.
 *
 * This file registers the values the pagination controls default to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve. The options
 * themselves, and the types that name them, live in `@asheeui/core`: they are the
 * framework's pagination contract rather than a web renderer's, and the native renderer
 * reads the same ones from the same place. What stays here is the web default values and
 * the registration that puts them in the web registry.
 */

import {
  type PaginationConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type { PaginationConfig };

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

registerComponentDefaults("pagination", defaultPaginationConfig);

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
