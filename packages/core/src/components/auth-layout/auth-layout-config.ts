/**
 * The AuthLayout's configuration face, shared by both platforms.
 *
 * An authentication page states four things about itself: whether the form is drawn on a
 * panel, how the form column is aligned, which side the product media sits on and how wide
 * the form is. Those are named here, once, so `components.authlayout` means the same thing in
 * a web application and in a native one.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `authlayout` here is what makes `components.authlayout` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { ContainerSize } from "../../shared/section-block";

/**
 * Vertical alignment of the form column.
 *
 * - `center`: the form is centred in the height it is given, which is what an authentication
 *   route with a short form wants.
 * - `start`: the form starts at the top, which is what a route with a long form or a message
 *   above it wants.
 */
export type AuthLayoutAlign = "center" | "start";

/**
 * Side the media column sits on.
 *
 * On the web the side is stated from the `lg` breakpoint upwards, where the two columns sit
 * beside each other; below it the media sits where the side puts it in the flow, which is
 * what a platform screen shows at every width, because a screen has no columns to reflow.
 */
export type AuthLayoutMediaPosition = "start" | "end";

/**
 * Theme configuration options for the AuthLayout component.
 *
 * Set under `components.authlayout` in the AsheeUI config. Values feed the component-level
 * tier of the theme cascade.
 */
export interface AuthLayoutConfig {
  /**
   * Whether the form is drawn on a panel.
   * A panel suits a page that also shows product media; without one the form sits directly
   * on the page background.
   *
   * @default true
   */
  panel?: boolean;

  /**
   * Vertical alignment of the form column.
   *
   * @default "center"
   */
  align?: AuthLayoutAlign;

  /**
   * Side the media column sits on.
   *
   * @default "end"
   */
  mediaPosition?: AuthLayoutMediaPosition;

  /**
   * Maximum width of the form column.
   *
   * @default "sm"
   */
  contentSize?: ContainerSize;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    authlayout: AuthLayoutConfig;
  }
}
