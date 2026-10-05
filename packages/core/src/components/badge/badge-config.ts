/**
 * The Badge's configuration face, shared by both platforms.
 *
 * The option names, the values they accept and their meaning are the part of the
 * Badge both renderers agree on, so they live here rather than in either renderer:
 * a consumer configures `components.badge` once and both platforms read the same
 * keys. What a renderer keeps for itself is the value each option *defaults to*,
 * because that is a platform property — a web badge is sized for a pointer and a
 * native badge for a label read at arm's length.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `badge` here is what makes `components.badge` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { Radius, Size } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";

/**
 * The visual treatments a badge can express.
 *
 * A badge is a label rather than a control: it has no baseline an underline could
 * sit on, and no pointer, so the `underlined` treatment a Button offers has no
 * meaning here. Excluding it from the type is what keeps a renderer's class map
 * complete rather than exhaustive-by-accident.
 */
export type BadgeVariant = Exclude<Variant, "underlined">;

/**
 * Theme configuration options for the Badge component.
 *
 * Set under `components.badge` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface BadgeConfig {
  /**
   * Visual style variant.
   * Controls the badge's background, border, and text treatment.
   *
   * @default "faded"
   */
  variant?: BadgeVariant;

  /**
   * Theme accent color.
   * Controls the badge's colour within the variant treatment.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Height and font-size scale.
   * Controls the density and text size of the badge.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Corner rounding.
   * Controls the border-radius of the badge.
   *
   * @default "full"
   */
  radius?: Radius;
}

/**
 * Resolve a treatment to one a badge can express.
 *
 * The platform defaults a component inherits are the framework's, not the badge's:
 * an application that sets `defaultVariant: "underlined"` for its buttons has not
 * asked for underlined badges. Because a badge cannot draw one, the treatment
 * resolves to its nearest equivalent rather than rendering nothing, which is a
 * rule both renderers share and neither restates.
 *
 * @param variant - The treatment the cascade produced.
 * @returns The treatment the badge renders.
 *
 * @example
 * ```ts
 * resolveBadgeVariant("underlined"); // "bordered"
 * resolveBadgeVariant("solid"); // "solid"
 * ```
 */
export function resolveBadgeVariant(variant: Variant): BadgeVariant {
  return variant === "underlined" ? "bordered" : variant;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    badge: BadgeConfig;
  }
}
