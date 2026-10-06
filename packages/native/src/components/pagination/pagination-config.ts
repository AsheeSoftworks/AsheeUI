/**
 * Pagination component configuration for the native package.
 *
 * The options are the ones the framework's pagination contract names, so
 * `components.pagination` is configured the same way on both platforms, and the types are
 * re-exported from `@asheeui/core` rather than restated here. What stays with the renderer
 * is the value each option defaults to on the platform, and the registration that puts it in
 * the native registry.
 */

import type { PaginationConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type { PaginationConfig } from "@asheeui/core";

/**
 * Configuration options for the native collection footer.
 */
export type NativePaginationConfig = PaginationConfig;

/**
 * The defaults the collection footer registers with the native registry.
 *
 * They are the web's own values, including the two the platform has no trail to apply
 * (`siblingCount` and `showEdges`): the options still resolve, so a configuration written
 * for a browser describes a device as well rather than quietly becoming something else.
 */
export const defaultNativePaginationConfig: NativePaginationConfig = {
  size: "md",
  radius: "md",
  siblingCount: 1,
  showEdges: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    pagination: NativePaginationConfig;
  }
}

registerNativeComponentDefaults("pagination", defaultNativePaginationConfig);

/**
 * The values the collection footer falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_PAGINATION_CONFIG: Required<NativePaginationConfig> =
  {
    size: "md",
    variant: "bordered",
    color: "primary",
    radius: "md",
    siblingCount: 1,
    showEdges: false,
  } as const;
