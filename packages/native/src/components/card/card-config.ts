/**
 * Card component configuration for the native package.
 *
 * The options are the ones the framework's card contract names. The treatment is
 * resolved as a surface plus an accent rather than as a filled variant matrix,
 * because a card's colour is an accent on a surface rather than a fill: the same
 * reason the platform's own surfaces are neutral by default.
 */

import type { ColorRole, Radius, Size, Variant } from "@asheeui/shared";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Card.
 */
export interface NativeCardConfig {
  /** Visual treatment of the surface. Defaults to "bordered". */
  variant?: Variant;

  /** Accent colour of the surface's border. Defaults to "primary". */
  color?: ColorRole;

  /** Density, which decides padding and text size. Defaults to "md". */
  size?: Size;

  /** Corner rounding. Defaults to the platform's `defaultRadius`. */
  radius?: Radius;

  /** Whether the whole card responds to a press. Defaults to false. */
  isPressable?: boolean;
}

/**
 * The defaults the Card registers with the native registry.
 *
 * `variant` is pinned because a card's documented default is a bordered surface:
 * leaving it out would let the platform's filled default turn every card into a
 * raised panel, which is not what a card is for.
 */
export const defaultNativeCardConfig: NativeCardConfig = {
  variant: "bordered",
  size: "md",
  isPressable: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    card: NativeCardConfig;
  }
}

registerNativeComponentDefaults("card", defaultNativeCardConfig);

/**
 * The values the card falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_CARD_CONFIG: Required<NativeCardConfig> = {
  variant: "bordered",
  color: "primary",
  size: "md",
  radius: "md",
  isPressable: false,
};
