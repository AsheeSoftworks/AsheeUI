/**
 * DocsLayout component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the documentation
 * composition: the names of its landmarks, the width of its navigation column
 * and whether its table of contents stays in view. It registers the default
 * configuration with the component registry and provides fallback values for the
 * cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { SidebarLayoutWidth } from "../sidebar-layout/sidebar-layout-config";

/**
 * Theme configuration options for the DocsLayout component.
 *
 * Set under `components.docslayout` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface DocsLayoutConfig {
  /**
   * Name of the navigation landmark.
   * It distinguishes the documentation navigation from the other navigation
   * regions a page may have.
   *
   * @default "Documentation"
   */
  navigationLabel?: string;

  /**
   * Name of the table of contents landmark.
   *
   * @default "On this page"
   */
  tocLabel?: string;

  /**
   * Width of the navigation column from the `lg` breakpoint upwards.
   *
   * @default "md"
   */
  navigationWidth?: SidebarLayoutWidth;

  /**
   * Whether the table of contents stays in view while the article scrolls.
   *
   * @default true
   */
  stickyToc?: boolean;

  /**
   * Whether the composition renders a skip link to its main region.
   *
   * @default true
   */
  skipLink?: boolean;

  /**
   * Wording of the skip link.
   *
   * @default "Skip to content"
   */
  skipLinkLabel?: string;
}

/**
 * Default config values registered for the DocsLayout component.
 */
export const defaultDocsLayoutConfig: DocsLayoutConfig = {
  navigationLabel: "Documentation",
  tocLabel: "On this page",
  navigationWidth: "md",
  stickyToc: true,
  skipLink: true,
  skipLinkLabel: "Skip to content",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    docslayout: DocsLayoutConfig;
  }
}

registerComponentDefaults("docslayout", defaultDocsLayoutConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_DOCS_LAYOUT_CONFIG: Required<DocsLayoutConfig> = {
  navigationLabel: "Documentation",
  tocLabel: "On this page",
  navigationWidth: "md",
  stickyToc: true,
  skipLink: true,
  skipLinkLabel: "Skip to content",
};
