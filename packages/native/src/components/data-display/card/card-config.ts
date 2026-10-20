/**
 * Card component configuration for the native package.
 *
 * The options are the ones the framework's card contract names. The treatment is
 * resolved as a surface plus an accent rather than as a filled variant matrix,
 * because a card's colour is an accent on a surface rather than a fill: the same
 * reason the platform's own surfaces are neutral by default.
 */

import type { ColorRole, Radius, Size, Variant } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

/**
 * The treatments a native card can draw.
 *
 * They are the framework's own vocabulary, because a card surface can express every one
 * of them: a filled `solid`, a translucent `faded`, an outlined `bordered`, a bare
 * `ghost` and a ruled `underlined` surface.
 */
export type NativeCardVariant = Variant;

/**
 * Configuration options for the native Card.
 */
export interface NativeCardConfig {
  /**
   * Visual treatment of the surface.
   * Defaults to the application's `defaultVariant`; the hard fallback is `"bordered"`.
   * The native card draws the shared vocabulary directly, and a surface name from
   * either platform resolves to a native one — see {@link resolveNativeCardVariant}.
   */
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
 * A card surface for each treatment the shared vocabulary can name.
 *
 * The native card draws the shared treatment vocabulary directly — `solid`, `faded`,
 * `bordered`, `ghost` and `underlined` each have a surface of their own — so every value
 * the cascade can produce reaches the class map without being translated. The web card
 * owns a different four-surface vocabulary and needs a mapping function
 * (`resolveCardVariant` in the web package) to land the shared names on one of its
 * surfaces; native does not, and translating here would only move a surface the card can
 * already draw.
 *
 * The map exists for the value no signature can rule out. A plain JS or JSON
 * configuration can name any string at runtime, and one that leaks across from the web —
 * a shared config object naming the web card's `elevated` or `flat` surface — must land
 * on a sensible native surface rather than miss the class map and render an unstyled
 * block. `elevated` and `flat` are both the web's filled surface, which native's `solid`
 * states with the same `bg-secondary` fill.
 */
const NATIVE_CARD_VARIANT_FOR_TREATMENT: Record<string, NativeCardVariant> = {
  solid: "solid",
  faded: "faded",
  bordered: "bordered",
  ghost: "ghost",
  underlined: "underlined",
  elevated: "solid",
  flat: "solid",
};

/**
 * Resolve a treatment to the native card surface to render.
 *
 * The cascade's component and global tiers can name a treatment from either platform's
 * vocabulary, so this is where the two meet. A native treatment keeps its own surface;
 * a web-only surface name is translated; a value no type can express — a plain JS or
 * JSON configuration can name any string — falls back to the card's documented default
 * rather than answering `undefined`.
 *
 * @param treatment - The treatment the cascade produced.
 * @returns The surface the card renders.
 *
 * @example
 * ```ts
 * resolveNativeCardVariant("solid"); // "solid"
 * resolveNativeCardVariant("faded"); // "faded"
 * ```
 */
export function resolveNativeCardVariant(
  treatment: Variant,
): NativeCardVariant {
  return (
    NATIVE_CARD_VARIANT_FOR_TREATMENT[treatment] ??
    FALLBACK_NATIVE_CARD_CONFIG.variant
  );
}

/**
 * The defaults the Card registers with the native registry.
 *
 * `variant` and `radius` are intentionally absent so they inherit from the application's
 * `defaultVariant` / `defaultRadius`. Registering a variant here would make the component
 * tier always answer, and the application's default would never reach a native card.
 * {@link FALLBACK_NATIVE_CARD_CONFIG} still states `bordered`, which is what the resolver
 * lands on for a treatment no signature can name.
 */
export const defaultNativeCardConfig: NativeCardConfig = {
  size: "md",
  isPressable: false,
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    card: NativeCardConfig;
  }
}

registerNativeComponentDefaults("card", defaultNativeCardConfig);

/**
 * The values the card falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_CARD_CONFIG = {
  variant: "bordered",
  color: "primary",
  size: "md",
  radius: "md",
  isPressable: false,
} satisfies NativeCardConfig;
