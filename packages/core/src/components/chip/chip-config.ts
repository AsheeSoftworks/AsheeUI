/**
 * The Chip's configuration face, shared by both platforms.
 *
 * The option names, the values they accept and their meaning are the part of the Chip
 * both renderers agree on, so a consumer configures `components.chip` once and both
 * platforms read the same keys. What a renderer keeps for itself is the value each option
 * defaults to, because that is a platform property.
 *
 * The treatment list is narrower than a Button's on purpose. A chip is a token rather than
 * a control with a baseline, so `underlined` names nothing a chip could draw, and leaving
 * it out of the type is what keeps a renderer's class map complete rather than complete by
 * accident — the same rule the badge follows.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `chip` here is what makes `components.chip` a known configuration
 * section, on every platform, without each renderer restating it.
 */

import type { Radius, Size } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";

/**
 * Visual style of the chip.
 *
 * The `underlined` button variant is excluded because it has no chip-appropriate visual
 * treatment.
 */
export type ChipVariant = Exclude<Variant, "underlined">;

/**
 * Height and font-size scale of the chip.
 * Maps to the standard Size type: "sm", "md", or "lg".
 */
export type ChipSizeKey = Size;

/**
 * Corner rounding scale of the chip.
 * Maps to the standard Radius type.
 */
export type ChipRadiusKey = Radius;

/**
 * Theme configuration options for the Chip component.
 *
 * Set under `components.chip` in the AsheeUI config. Values feed the component-level
 * fallback tier of the theme cascade.
 */
export interface ChipConfig {
  /**
   * Visual style variant.
   * Controls the chip's background, border, and hover treatment.
   *
   * @default "bordered"
   */
  variant?: ChipVariant;

  /**
   * Theme accent color.
   * Controls the color of the chip's primary visual elements.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Height and font-size scale.
   * Controls the density and text size of the chip.
   *
   * @default "md"
   */
  size?: ChipSizeKey;

  /**
   * Corner rounding.
   * Controls the border-radius of the chip.
   *
   * @default "full"
   */
  radius?: ChipRadiusKey;
}

/**
 * Resolve a treatment to one a chip can express.
 *
 * The platform defaults a component inherits are the framework's, not the chip's: an
 * application that sets `defaultVariant: "underlined"` for its buttons has not asked for
 * underlined chips. Because a chip cannot draw one, the treatment resolves to its nearest
 * equivalent rather than rendering nothing, which is a rule both renderers share and
 * neither restates.
 *
 * @param variant - The treatment the cascade produced.
 * @returns The treatment the chip renders.
 *
 * @example
 * ```ts
 * resolveChipVariant("underlined"); // "bordered"
 * resolveChipVariant("faded"); // "faded"
 * ```
 */
export function resolveChipVariant(variant: Variant): ChipVariant {
  return variant === "underlined" ? "bordered" : variant;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    chip: ChipConfig;
  }
}
