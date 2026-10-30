/**
 * The surface the web card draws, from the treatment the cascade produced.
 *
 * The card is a surface rather than a control, so it cannot draw every treatment the
 * shared vocabulary names: the framework names five, the web card draws four, and
 * `faded` / `underlined` land on its bordered edge. `@asheeui/core`'s `resolveCardVariant`
 * states the shared half of that rule — which treatment a name means — and this module
 * states the web half: which surface the card draws for it.
 *
 * The two halves are separate on purpose. The rule is the same on both renderers and lives
 * in core; the surface vocabulary is the renderer's own, and a copy of *that* table in core
 * would have to know every renderer's class map. The platform card has five surfaces and
 * needs no projection at all.
 *
 * This module is not re-exported by the card's barrel: it is the component's own step
 * between the rule and its class map, not part of the package's surface.
 */

import { resolveCardVariant, type Variant } from "@asheeui/core";
import { FALLBACK_CARD_CONFIG } from "./card-config";

/**
 * The four surfaces the web card paints.
 *
 * The framework's `CardVariant` — now `@asheeui/core`'s — is the seven names a consumer may write:
 * the five shared treatments plus this renderer's `elevated` and `flat`. A *surface* is what the card
 * actually draws, and only the four below have a class map behind them. Keeping the two types apart
 * is what lets `components.card.variant` accept `solid` on both platforms while the web still paints
 * `elevated` for it.
 */
export type CardSurface = "elevated" | "bordered" | "flat" | "ghost";

/**
 * The card's own surface names, taken as themselves.
 *
 * `flat` and `elevated` are surfaces only this renderer draws, so a configuration that
 * names one has to reach the class map unchanged rather than through the shared
 * vocabulary — core maps both onto the filled treatment, which would turn `flat` into
 * `elevated`.
 */
const CARD_SURFACE_FOR_NAME: Record<string, CardSurface> = {
  elevated: "elevated",
  flat: "flat",
  bordered: "bordered",
  ghost: "ghost",
};

/**
 * The surface the web card draws for each shared treatment.
 *
 * `solid` is the filled, highest-emphasis treatment, and the web card's filled surface is
 * `elevated` (`bg-secondary`). `faded` is the framework's resting treatment and the
 * shipped `defaultVariant`, and a card's resting surface is its documented default,
 * `bordered` — so the framework default keeps rendering a bordered card rather than
 * restyling every unconfigured card at once. `underlined` has no baseline to rule, so it
 * lands on the nearest surface the card can draw.
 */
const CARD_SURFACE_FOR_TREATMENT: Record<Variant, CardSurface> = {
  solid: "elevated",
  faded: "bordered",
  bordered: "bordered",
  ghost: "ghost",
  underlined: "bordered",
};

/**
 * Resolve a treatment to the card surface the web card draws.
 *
 * A plain JS or JSON consumer can name any string at runtime, so a name neither the card
 * nor the shared vocabulary knows falls back to the card's documented default rather than
 * answering `undefined` and rendering an unstyled surface.
 *
 * @param treatment - The treatment the cascade produced.
 * @returns The card surface to render.
 *
 * @example
 * ```ts
 * cardSurfaceFor("solid"); // "elevated"
 * cardSurfaceFor("faded"); // "bordered"
 * cardSurfaceFor("flat"); // "flat", the card's own surface, unchanged
 * ```
 */
export function cardSurfaceFor(treatment: string): CardSurface {
  return (
    CARD_SURFACE_FOR_NAME[treatment] ??
    CARD_SURFACE_FOR_TREATMENT[resolveCardVariant(treatment)] ??
    FALLBACK_CARD_CONFIG.variant
  );
}
