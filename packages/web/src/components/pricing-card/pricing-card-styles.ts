/**
 * PricingCard component styles for AsheeUI.
 * This file provides the static class mappings for the PricingCard pattern.
 */

/** The price line, where the amount and the period sit on one baseline. */
export const PRICING_PRICE_CLASS = "flex items-baseline gap-1";

/** The list of included and excluded features. */
export const PRICING_FEATURES_CLASS = "flex flex-col gap-2";

/** One feature line. */
export const PRICING_FEATURE_CLASS = "flex items-start gap-2";

/** The marker of an included feature. */
export const PRICING_FEATURE_INCLUDED_CLASS =
  "mt-1 size-4 shrink-0 text-success";

/** The marker of an excluded feature. */
export const PRICING_FEATURE_EXCLUDED_CLASS =
  "mt-1 size-4 shrink-0 text-foreground/40";

/** The badge above the plan name. */
export const PRICING_BADGE_CLASS =
  "inline-flex w-fit items-center rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary";

/** The ring that marks the recommended plan. */
export const PRICING_HIGHLIGHTED_CLASS = "border-primary ring-1 ring-primary";

/** The body arrangement of the card. */
export const PRICING_BODY_CLASS = "flex flex-col gap-6";
