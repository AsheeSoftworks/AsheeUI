/**
 * The MarketingLayout's configuration face, shared by both platforms.
 *
 * A marketing composition states three things about itself: what it paints behind its
 * sections, whether it offers a way past its navigation, and what that way says. Those are
 * named here, once, so `components.marketinglayout` means the same thing in a web
 * application and in a native one.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `marketinglayout` here is what makes `components.marketinglayout` a
 * known configuration section, on every platform, without each renderer restating it.
 */

/**
 * The background a marketing composition paints behind its content.
 *
 * - `default`: the theme background, for a page whose sections carry their own surfaces.
 * - `muted`: a recessed background, for a page whose sections are cards.
 */
export type MarketingLayoutBackground = "default" | "muted";

/**
 * Theme configuration options for the MarketingLayout component.
 *
 * Set under `components.marketinglayout` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface MarketingLayoutConfig {
  /**
   * Whether the composition renders a skip link to its main region.
   *
   * A marketing page leads with navigation, so a keyboard reader needs to be able to pass
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

  /**
   * Background the composition paints.
   *
   * @default "default"
   */
  background?: MarketingLayoutBackground;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    marketinglayout: MarketingLayoutConfig;
  }
}
