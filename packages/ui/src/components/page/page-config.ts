/**
 * Page component configuration for AsheeUI.
 * This file defines the configuration type and defaults shared by the four page
 * parts (`Page`, `PageHeader`, `PageContent`, `PageFooter`): nesting behaviour,
 * container width, content rhythm, stickiness and separators. It registers the
 * default configuration with the component registry and provides fallback
 * values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Space } from "../../shared";
import type { ContainerSize } from "../container/container-config";

/**
 * Theme configuration options shared by the page parts.
 *
 * Set under `components.page` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade for all four parts, so an
 * application can set its page shell once.
 */
export interface PageConfig {
  /**
   * Whether a part wraps its content in a {@link Container}.
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
   * Whether the header stays at the top of the viewport while the content
   * scrolls.
   *
   * @default true
   */
  sticky?: boolean;

  /**
   * Whether the header and the footer draw a separator line against the
   * content.
   *
   * @default true
   */
  divider?: boolean;
}

/**
 * Default config values registered for the page parts.
 */
export const defaultPageConfig: PageConfig = {
  contained: true,
  containerSize: "lg",
  spacing: "md",
  sticky: true,
  divider: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    page: PageConfig;
  }
}

registerComponentDefaults("page", defaultPageConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_PAGE_CONFIG: Required<PageConfig> = {
  contained: true,
  containerSize: "lg",
  spacing: "md",
  sticky: true,
  divider: true,
};
