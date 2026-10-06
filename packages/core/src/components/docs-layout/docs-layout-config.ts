/**
 * The DocsLayout's configuration face, shared by both platforms.
 *
 * A documentation composition states five things about itself: the names of its two landmarks,
 * the width of its navigation column, whether the table of contents stays in view and whether it
 * offers a way past the navigation. Those are named here, once, so `components.docslayout` means
 * the same thing in a web application and in a native one.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `docslayout` here is what makes `components.docslayout` a known configuration
 * section, on every platform, without each renderer restating it.
 */

import type { SidebarLayoutWidth } from "../sidebar-layout/sidebar-layout-config";

/**
 * Theme configuration options for the DocsLayout component.
 *
 * Set under `components.docslayout` in the AsheeUI config. Values feed the component-level tier
 * of the theme cascade.
 */
export interface DocsLayoutConfig {
  /**
   * Name of the navigation landmark.
   * It distinguishes the documentation navigation from the other navigation regions a page may
   * have. The platform has no landmark to name, so it states the name as the title of the
   * section it shows the navigation in, which is the platform's way of naming a region.
   *
   * @default "Documentation"
   */
  navigationLabel?: string;

  /**
   * Name of the table of contents landmark.
   * It becomes the title of the contents section on the platform, for the same reason.
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
   * A native screen stacks its sections and scrolls as a whole, so there is nothing for this
   * option to pin and it resolves through the shared contract without changing the rendering.
   *
   * @default true
   */
  stickyToc?: boolean;

  /**
   * Whether the composition renders a skip link to its main region.
   *
   * A documentation page leads with navigation, so a keyboard reader needs to be able to pass
   * it; the link is rendered as the first focusable element. A platform screen has no focus
   * order to skip through — its reader moves between elements directly — so this option
   * resolves through the shared contract and changes nothing there.
   *
   * @default true
   */
  skipLink?: boolean;

  /**
   * Wording of the skip link, where one is rendered.
   *
   * @default "Skip to content"
   */
  skipLinkLabel?: string;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    docslayout: DocsLayoutConfig;
  }
}
