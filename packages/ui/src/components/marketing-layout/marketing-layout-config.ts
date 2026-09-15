/**
 * MarketingLayout component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the marketing page
 * composition: whether it renders a skip link, what that link says, and which
 * background it paints. It registers the default configuration with the
 * component registry and provides fallback values for the cascade resolution
 * system.
 */

import { registerComponentDefaults } from "../../libs/registry";

/**
 * The background a marketing composition paints behind its content.
 *
 * - `default`: the theme background, for a page whose sections carry their own
 *   surfaces.
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
   * A marketing page leads with navigation, so a keyboard reader needs to be
   * able to pass it; the link is rendered as the first focusable element.
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

  /**
   * Background the composition paints.
   *
   * @default "default"
   */
  background?: MarketingLayoutBackground;
}

/**
 * Default config values registered for the MarketingLayout component.
 * The skip link is on by default because it is the accessible choice, and it
 * costs nothing when it is not used.
 */
export const defaultMarketingLayoutConfig: MarketingLayoutConfig = {
  skipLink: true,
  skipLinkLabel: "Skip to content",
  background: "default",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    marketinglayout: MarketingLayoutConfig;
  }
}

registerComponentDefaults("marketinglayout", defaultMarketingLayoutConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_MARKETING_LAYOUT_CONFIG: Required<MarketingLayoutConfig> =
  {
    skipLink: true,
    skipLinkLabel: "Skip to content",
    background: "default",
  };
