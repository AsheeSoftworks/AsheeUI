/**
 * PricingCard component configuration for the native package.
 *
 * The options are the ones the framework's pricing-card contract names, so
 * `components.pricingcard` is configured the same way on both platforms, and the types are
 * re-exported from `@asheeui/core` rather than restated here. What stays with the renderer
 * is the value each option defaults to on the platform, and the registration that puts it
 * in the native registry.
 */

import type { PricingCardConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  PricingCardConfig,
  PricingCardVariant,
  PricingFeatureItem,
} from "@asheeui/core";

/**
 * Configuration options for the native PricingCard.
 */
export type NativePricingCardConfig = PricingCardConfig;

/**
 * The defaults the PricingCard registers with the native registry.
 *
 * They are the web's own values: a plan is a bordered surface at the framework's largest
 * density, and it is not the recommended one until an application says so. The platform
 * adds nothing to them, because a pricing table is the same table on a phone: what differs
 * is that a phone shows one plan per screen, which is the consumer's layout decision rather
 * than the card's.
 */
export const defaultNativePricingCardConfig: NativePricingCardConfig = {
  variant: "bordered",
  size: "lg",
  highlighted: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    pricingcard: NativePricingCardConfig;
  }
}

registerNativeComponentDefaults("pricingcard", defaultNativePricingCardConfig);

/**
 * The values the PricingCard falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_PRICING_CARD_CONFIG: Required<NativePricingCardConfig> =
  {
    variant: "bordered",
    size: "lg",
    highlighted: false,
  };
