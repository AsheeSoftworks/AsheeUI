/**
 * The PricingCard's configuration face, shared by both platforms.
 *
 * One plan states the same three things on both platforms: how its surface is treated,
 * how much room its body takes, and whether it is the recommended plan. Those are named
 * here, once, so `components.pricingcard` means the same thing in a web application and in
 * a native one.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `pricingcard` here is what makes `components.pricingcard` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { ReactNode } from "react";
import type { Size } from "../../shared/radius";

/**
 * One line of a plan's feature list.
 *
 * The line is data rather than markup on both platforms: a plan states what it includes,
 * and each renderer says it the way its own reader expects.
 */
export interface PricingFeatureItem {
  /** Stable identifier for the line. Defaults to its position in the list. */
  id?: string | number;

  /** What the line says. */
  label: ReactNode;

  /**
   * Whether the plan includes this line.
   * An excluded line also carries the wording "(not included)" for assistive
   * technology, so the meaning never depends on the visual treatment alone.
   *
   * @default true
   */
  included?: boolean;
}

/**
 * Surface treatment of a pricing card.
 * These map to the framework's card treatments, so a pricing card looks like the
 * rest of the surface system.
 *
 * - `bordered`: a defined edge, for a plan that sits among equals.
 * - `elevated`: a raised surface, for the plan a reader is meant to look at first.
 *
 * The platform's own card has no raised treatment to reach for — the web paints a shadow
 * and the platform's card paints a neutral surface — so a native pricing card resolves
 * `elevated` to the platform's filled surface, which is the same colour without a shadow
 * the platform does not paint.
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

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    pricingcard: PricingCardConfig;
  }
}
