/**
 * PricingCard component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the PricingCard
 * pattern: card treatment, highlight and density. It registers the default
 * configuration with the component registry and provides fallback values for the
 * cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Size } from "../../shared";

/**
 * Surface treatment of a pricing card.
 * These map to the framework's card variants, so a pricing card looks like the
 * rest of the surface system.
 */
export type PricingCardVariant = "bordered" | "elevated";

/**
 * Theme configuration options for the PricingCard component.
 *
 * Set under `components.pricingcard` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface PricingCardConfig {
  /** Surface treatment. @default "bordered" */
  variant?: PricingCardVariant;

  /** Density of the card padding. @default "lg" */
  size?: Size;

  /** Whether the card is the recommended plan. @default false */
  highlighted?: boolean;
}

/**
 * Default config values registered for the PricingCard component.
 */
export const defaultPricingCardConfig: PricingCardConfig = {
  variant: "bordered",
  size: "lg",
  highlighted: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    pricingcard: PricingCardConfig;
  }
}

registerComponentDefaults("pricingcard", defaultPricingCardConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_PRICING_CARD_CONFIG: Required<PricingCardConfig> = {
  variant: "bordered",
  size: "lg",
  highlighted: false,
};
