/**
 * Card component configuration for the native package.
 *
 * The *shape* of `components.card` is `@asheeui/core`'s: the treatment, the accent, the density, the
 * corner and the press options are stated once, for both platforms, in
 * `packages/core/src/components/data-display/card/card-config.ts`. This module keeps what is the
 * platform's — the values it registers and the hard fallbacks it states — because those are values
 * rather than vocabulary.
 *
 * The treatment is resolved as a surface plus an accent rather than as a filled variant matrix,
 * because a card's colour is an accent on a surface rather than a fill: the same reason the
 * platform's own surfaces are neutral by default.
 */

import {
  type CardConfig,
  deprecatedAlias,
  deprecateMany,
  resolveCardVariant,
  type Variant,
} from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export { resolveCardVariant };

export type {
  CardConfig,
  CardImageConfig,
  CardImageLoading,
  CardImagePosition,
  CardVariant,
} from "@asheeui/core";

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
 *
 * A native card is a surface, so it states the options it draws and leaves the two the web's card
 * owns — `animate`, whose feedback the platform's own `Pressable` supplies, and `image`, which the
 * platform lays out through its own component. Both are accepted by the shared `CardConfig`; this is
 * the documented subset a device implements.
 *
 * @deprecated Use {@link CardConfig} from `@asheeui/core` — the name both renderers publish.
 */
export type NativeCardConfig = Omit<CardConfig, "animate" | "image">;

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
 *
 * @deprecated Use {@link defaultCardConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
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
 *
 * @deprecated Use {@link FALLBACK_CARD_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_CARD_CONFIG = {
  variant: "bordered",
  color: "primary",
  size: "md",
  radius: "md",
  isPressable: false,
} satisfies NativeCardConfig;
