import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";

/**
 * Visual style of the chip.
 *
 * The `underlined` button variant is excluded because it has no
 * chip-appropriate visual treatment.
 */
export type ChipVariant = Exclude<Variant, "underlined">;

/** Height and font-size scale of the chip. */
export type ChipSizeKey = Size;

/** Corner rounding scale of the chip. */
export type ChipRadiusKey = Radius;

/**
 * Theme configuration options for the Chip component.
 *
 * Set under `components.chip` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ChipConfig {
  /** Visual style variant.
   *
   * @default "bordered"
   */
  variant?: ChipVariant;
  /** Theme accent color.
   *
   * @default "primary"
   */
  color?: Color;
  /** Height and font-size scale.
   *
   * @default "md"
   */
  size?: ChipSizeKey;
  /** Corner rounding.
   *
   * @default "full"
   */
  radius?: ChipRadiusKey;
  /** Extra classes applied to every chip instance.
   *
   * @default ""
   */
  className?: string;
}

/**
 * Default config values registered for the Chip component.
 *
 * `variant` and `color` are intentionally absent so they inherit from
 * the global `defaultVariant` / `defaultColor`.
 */
export const defaultChipConfig: ChipConfig = {
  size: "md",
  radius: "full",
};

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_CHIP_CONFIG: Required<ChipConfig> = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "full",
  className: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    chip: ChipConfig;
  }
}

registerComponentDefaults("chip", defaultChipConfig);
