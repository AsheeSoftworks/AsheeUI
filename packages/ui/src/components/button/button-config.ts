import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";

/** Padding and font-size scale of the button. */
export type ButtonSizeKey = Size;

/** Corner rounding scale of the button. */
export type ButtonRadiusKey = Radius;

/**
 * Theme configuration options for the Button component.
 *
 * Set under `components.button` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ButtonConfig {
  /** Visual style variant.
   *
   * @default "bordered"
   */
  variant?: Variant;
  /** Theme accent color.
   *
   * @default "primary"
   */
  color?: Color;
  /** Padding and font-size scale.
   *
   * @default "md"
   */
  size?: ButtonSizeKey;
  /** Corner rounding.
   *
   * @default "md"
   */
  radius?: ButtonRadiusKey;
  /** Enables the press-down scale animation.
   *
   * @default true
   */
  animate?: boolean;
  /** Makes the button stretch to fill its parent width.
   *
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Default config values registered for the Button component.
 *
 * `variant`, `color`, and `radius` are intentionally absent so they
 * inherit from the global `defaultVariant` / `defaultColor` /
 * `defaultRadius`.
 */
export const defaultButtonConfig: ButtonConfig = {
  size: "md",
  animate: true,
  fullWidth: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    button: ButtonConfig;
  }
}

registerComponentDefaults("button", defaultButtonConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_BUTTON_CONFIG: Required<ButtonConfig> = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "md",
  animate: true,
  fullWidth: false,
} as const;
