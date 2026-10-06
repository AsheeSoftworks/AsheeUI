/**
 * MarketingLayout component configuration for AsheeUI.
 *
 * This file registers the values the marketing composition defaults to on the web, so the
 * component-level tier of the theme cascade has a value to resolve. The options themselves,
 * and the types that name them, live in `@asheeui/core`: they are the framework's
 * marketing-layout contract rather than a web renderer's, and the native renderer reads the
 * same ones from the same place. What stays here is the web default values and the
 * registration that puts them in the web registry.
 */

import {
  type MarketingLayoutConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type {
  MarketingLayoutBackground,
  MarketingLayoutConfig,
} from "@asheeui/core";

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
