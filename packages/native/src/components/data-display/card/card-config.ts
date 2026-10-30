/**
 * Card component configuration for the native package.
 *
 * The options are the ones the framework's card contract names. The treatment is
 * resolved as a surface plus an accent rather than as a filled variant matrix,
 * because a card's colour is an accent on a surface rather than a fill: the same
 * reason the platform's own surfaces are neutral by default.
 */

import {
  type ColorRole,
  deprecatedAlias,
  deprecateMany,
  type Radius,
  resolveCardVariant,
  type Size,
  type Variant,
} from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export { resolveCardVariant };

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
 * A card surface for each treatment the shared vocabulary can name, and for the web
 * card's own two surface names.
 *
 * The rule is `@asheeui/core`'s `resolveCardVariant`: the native card draws the shared
 * treatment vocabulary directly — `solid`, `faded`, `bordered`, `ghost` and `underlined`
 * each have a surface of their own — while the web card owns a different four-surface
 * vocabulary and projects the resolved treatment onto one of its own. The map used to live
 * here, and moving it means a name that leaks across from the web — a shared configuration
 * naming `elevated` or `flat` — resolves the same way for both renderers instead of only
 * for this one.
 */

// ─── Deprecated: the platform-suffixed spelling, removed in the next major ───

deprecateMany("@asheeui/native/card", [
  {
    from: "resolveNativeCardVariant",
    to: "resolveCardVariant",
    since: "2.8.0",
  },
]);

/**
 * Resolve a treatment to the surface the card renders.
 *
 * @param treatment - The treatment the cascade produced.
 * @returns The surface the card renders.
 */
export const resolveNativeCardVariant = deprecatedAlias(resolveCardVariant);

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
