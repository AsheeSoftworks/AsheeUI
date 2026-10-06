/**
 * The Pagination's configuration face, shared by both platforms.
 *
 * A paged collection says the same things on both platforms: how its controls are dressed,
 * how much of the collection is shown around the reader's place in it, and whether the ends
 * of the collection are offered as well. Those are named here, once, so
 * `components.pagination` means the same thing in a web application and in a native one.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `pagination` here is what makes `components.pagination` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { Radius, Size } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";

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
   * How many pages to show on each side of the current page, on the web.
   * A wider range shows more of the collection at once; a narrower range keeps
   * the trail short.
   *
   * The platform draws no numbered trail — its lists grow as the reader reaches the end,
   * which is the platform's own way of moving through a collection — so this option
   * resolves through the contract and changes nothing there.
   *
   * @default 1
   */
  siblingCount?: number;

  /**
   * Whether the trail offers controls for the first and last page, on the web.
   *
   * The platform draws no trail, so this option resolves through the contract and changes
   * nothing there. See `siblingCount`.
   *
   * @default false
   */
  showEdges?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    pagination: PaginationConfig;
  }
}
