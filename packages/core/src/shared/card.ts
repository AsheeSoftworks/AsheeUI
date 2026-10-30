/**
 * The card's surface rule, shared by both renderers.
 *
 * A card is configured with a *treatment* — the shared vocabulary every component speaks
 * (`solid`, `faded`, `bordered`, `ghost`, `underlined`) — and it draws a *surface*, which
 * is its own: the web card has four (`faded` and `underlined` land on its bordered edge)
 * and the platform card has five. The two vocabularies meet here so that a name one
 * renderer publishes lands on something the other can draw, instead of missing the class
 * map and rendering an unstyled block.
 *
 * The rule is the platform's table, and that is the point of putting it in core: it speaks
 * the shared vocabulary, and the web's two extra surface names are mapped onto it rather
 * than the other way round. A web surface name that leaked into a shared configuration
 * (`elevated`, `flat`) is not a treatment anything can branch on, and a device drawing
 * `elevated` would have no class behind it.
 */

import type { Variant } from "../tokens";

/**
 * The treatment a card falls back to when the name it was given is not one it knows.
 *
 * Both renderers already state this as their own fallback: a card's documented default
 * surface is the bordered one.
 */
export const FALLBACK_CARD_TREATMENT: Variant = "bordered";

/**
 * The shared treatment each known name states.
 *
 * The five treatments map to themselves. The web card's two surface names map onto the
 * filled treatment, which is what both cards draw for them: the web's `elevated` surface
 * and the platform's `solid` surface are the same `bg-secondary` fill.
 */
const CARD_TREATMENT_FOR_NAME: Record<string, Variant> = {
  solid: "solid",
  faded: "faded",
  bordered: "bordered",
  ghost: "ghost",
  underlined: "underlined",
  elevated: "solid",
  flat: "solid",
};

/**
 * Resolve the treatment a card surface name states.
 *
 * A plain JS or JSON configuration can name any string at runtime, so a name the framework
 * does not know falls back to the card's default surface rather than to nothing.
 *
 * @param treatment - The treatment the cascade produced, or a surface name either renderer
 *   publishes.
 * @returns The shared treatment to draw.
 *
 * @example
 * ```ts
 * resolveCardVariant("elevated"); // "solid", the fill both cards draw for it
 * resolveCardVariant("unknown"); // "bordered"
 * ```
 */
export function resolveCardVariant(treatment: string): Variant {
  return CARD_TREATMENT_FOR_NAME[treatment] ?? FALLBACK_CARD_TREATMENT;
}
