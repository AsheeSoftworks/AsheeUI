/**
 * PricingCard component configuration for AsheeUI.
 *
 * This file registers the values the pricing card defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve. The options
 * themselves, and the types that name them, live in `@asheeui/core`: they are the
 * framework's pricing-card contract rather than a web renderer's, and the native renderer
 * reads the same ones from the same place. What stays here is the web default values and
 * the registration that puts them in the web registry.
 */

import {
  type PricingCardConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type { PricingCardConfig, PricingCardVariant } from "@asheeui/core";

/**
 * Default config values registered for the PricingCard component.
 */
export const defaultPricingCardConfig: PricingCardConfig = {
  variant: "bordered",
  size: "lg",
  highlighted: false,
};

registerComponentDefaults("pricingcard", defaultPricingCardConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_PRICING_CARD_CONFIG: Required<PricingCardConfig> = {
  variant: "bordered",
  size: "lg",
  highlighted: false,
};
