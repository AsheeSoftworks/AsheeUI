/**
 * Card component configuration for AsheeUI.
 *
 * The *shape* of `components.card` is `@asheeui/core`'s: the treatment, the density, the corner, the
 * image options and the two options a renderer draws or leaves alone are stated once, for both
 * platforms, in `packages/core/src/components/data-display/card/card-config.ts`. This module keeps
 * what is the web's — the defaults it registers and the hard fallbacks it states — because those are
 * values rather than vocabulary.
 *
 * The surface names this renderer draws are the web's own, so they stay here: `card-surface.ts`
 * projects the shared treatment vocabulary onto the four surfaces the card actually paints.
 */

import type { CardConfig } from "@asheeui/core";
import { registerComponentDefaults } from "@asheeui/core";

/**
 * The web's card surface names — re-exported under the framework's type name.
 *
 * The framework's `CardVariant` is the seven names a consumer may write (the five shared treatments
 * plus this renderer's `elevated` and `flat`); a *surface* is the narrower set the card paints, and
 * `card-surface.ts` owns that projection.
 */
export type {
  CardConfig,
  CardImageConfig,
  CardImageLoading,
  CardImagePosition,
  CardVariant,
} from "@asheeui/core";

/**
 * The shared rule that lands a treatment on a surface a card can draw.
 *
 * It lives in `@asheeui/core` because both renderers need it and because the platform's card draws
 * the shared vocabulary directly: the rule speaks the shared treatments and maps the web card's own
 * two surface names (`elevated`, `flat`) onto the filled one, so a configuration written for the web
 * lands somewhere sensible on a device. This package re-exports it under the same name, and projects
 * the result onto its own four surfaces in `card-surface.ts`.
 */
export { resolveCardVariant } from "@asheeui/core";

/**
 * Default config values registered for the Card component.
 *
 * `variant` and `radius` are intentionally absent so they inherit from
 * the global `defaultVariant` / `defaultRadius`. The inherited treatment names the
 * shared vocabulary rather than a card surface, so {@link resolveCardVariant} lands
 * it on one the card can draw: the shipped `faded` resolves to the card's documented
 * border default, while an application that sets `defaultVariant: "solid"` or
 * `"ghost"` reaches the matching card surface instead of silently rendering
 * `bordered`.
 */
export const defaultCardConfig: CardConfig = {
  size: "md",
  image: { position: "top", ratio: "video", fit: "cover" },
  animate: true,
};

registerComponentDefaults("card", defaultCardConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 *
 * These provide the absolute minimum defaults to ensure the card
 * renders correctly even when no configuration is available.
 */
export const FALLBACK_CARD_CONFIG = {
  size: "md",
  variant: "bordered",
  radius: "md",
  image: {
    position: "top",
    ratio: "video",
    fit: "cover",
    loading: "lazy",
  },
  animate: true,
} as const;
