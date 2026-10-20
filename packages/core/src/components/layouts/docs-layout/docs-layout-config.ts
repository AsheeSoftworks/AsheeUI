/**
 * The DocsLayout's configuration face, shared by both platforms.
 *
 * A documentation composition states six things about itself: the names of its two regions, the
 * width and the stickiness of its navigation column, whether the table of contents stays in view
 * and whether it offers a way past the navigation. Those are named here, once, so
 * `components.docslayout` means the same thing in a web application and in a native one.
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
   * Name of the navigation column, which the web renders as an `aside` — a
   * complementary landmark; the platform has no landmark vocabulary and states
   * the name as the title of the section it shows the navigation in. It
   * distinguishes the documentation navigation from the other regions a page may
   * have.
   *
   * @default "Documentation"
   */
  navigationLabel?: string | undefined;

  /**
   * Name of the table of contents landmark.
   * It becomes the title of the contents section on the platform, for the same reason.
   *
   * @default "On this page"
   */
  tocLabel?: string | undefined;

  /**
   * Width of the navigation column from the `lg` breakpoint upwards.
   *
   * @default "md"
   */
  navigationWidth?: SidebarLayoutWidth | undefined;

  /**
   * Whether the navigation column stays in view while the article scrolls.
   *
   * It is passed through to the shell as `stickySidebar`, so a documentation
   * page whose navigation is a short list can let the column leave with the
   * article. A native screen stacks its sections and scrolls as a whole, so
   * there is nothing for the platform to pin and the option resolves through the
   * shared contract without changing the rendering.
   *
   * @default true
   */
  stickyNavigation?: boolean | undefined;

  /**
   * Whether the table of contents stays in view while the article scrolls.
   *
   * A native screen stacks its sections and scrolls as a whole, so there is nothing for this
   * option to pin and it resolves through the shared contract without changing the rendering.
   *
   * @default true
   */
  stickyToc?: boolean | undefined;

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
  skipLink?: boolean | undefined;

  /**
   * Wording of the skip link, where one is rendered.
   *
   * @default "Skip to content"
   */
  skipLinkLabel?: string | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    docslayout: DocsLayoutConfig;
  }
}
