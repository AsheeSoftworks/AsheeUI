/**
 * The Button's configuration face, shared by both platforms.
 *
 * The option names, the values they accept and their meaning are the part of the
 * Button both renderers agree on, so they live here rather than in either renderer:
 * a consumer configures `components.button` once and both platforms read the same
 * keys. What a renderer keeps for itself is the value each option *defaults to*,
 * because that is a platform property — a web button is dense enough for a pointer
 * and a native button is large enough for a thumb.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `button` here is what makes `components.button` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { Radius, Size } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";

/**
 * Theme configuration options for the Button component.
 *
 * Set under `components.button` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ButtonConfig {
  /**
   * Visual style variant.
   * Controls the background, border, and hover treatment.
   *
   * @default "bordered"
   */
  variant?: Variant;

  /**
   * Theme accent color.
   * Controls the color of the button's primary visual elements.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Padding and font-size scale.
   * Controls the density and text size of the button.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Corner rounding.
   * Controls the border-radius of the button.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Enables the press-down scale animation.
   * When true, the button scales down slightly on click. The web resolves this
   * itself; native leaves the press feedback to the platform.
   *
   * @default true
   */
  animate?: boolean;

  /**
   * Makes the button stretch to fill its parent width.
   * When true, the button expands to 100% of its container width.
   *
   * @default false
   */
  fullWidth?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    button: ButtonConfig;
  }
}
