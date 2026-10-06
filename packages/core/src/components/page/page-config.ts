/**
 * The Page's configuration face, shared by both platforms.
 *
 * An application page is a shell and three parts — a header, a content area and a footer —
 * and all four answer the same questions about themselves: whether a part wraps its content
 * in a container, how wide that container may grow, how much vertical rhythm the content
 * area claims, whether the header stays put, and whether the parts are separated from each
 * other. Those questions are named here, once, so `components.page` means the same thing in
 * a web application and in a native one.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `page` here is what makes `components.page` a known configuration
 * section, on every platform, without each renderer restating it.
 */

import type { ContainerSize } from "../../shared/section-block";
import type { Space } from "../../shared/spacing";

/**
 * Theme configuration options shared by the page parts.
 *
 * Set under `components.page` in the AsheeUI config. Values feed the component-level
 * fallback tier of the theme cascade for all four parts, so an application can set its page
 * shell once.
 */
export interface PageConfig {
  /**
   * Whether a part wraps its content in a container.
   *
   * @default true
   */
  contained?: boolean;

  /**
   * Maximum content width used when a part is contained.
   *
   * @default "lg"
   */
  containerSize?: ContainerSize;

  /**
   * Vertical rhythm of the content area.
   *
   * @default "md"
   */
  spacing?: Space;

  /**
   * Whether the header stays at the top of the viewport while the content scrolls.
   *
   * @default true
   */
  sticky?: boolean;

  /**
   * Whether the header and the footer draw a separator line against the content.
   *
   * @default true
   */
  divider?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    page: PageConfig;
  }
}
