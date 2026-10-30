/**
 * The treatments a message surface can wear, per colour role, for the native renderer.
 *
 * An alert and a toast are the same kind of thing: a surface that carries a message in
 * one of the framework's colour roles. Both therefore ask the same question — what does
 * a `faded` surface in `danger` look like on the platform — and the answer has to be
 * one answer, because a consumer who retunes the treatment of a message cannot be left
 * with two components that disagree about it.
 *
 * The web answers the same question with the shared `resolveVariantClass`, so the
 * matrix that renderer reads lives in `shared/variant`. The platform's map cannot be
 * that one: the platform's utilities state a pressed state rather than a hover state,
 * and its corner scale is its own. So the map is stated here, once, for every message
 * surface the platform draws.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Variant } from "./variant";

/**
 * The treatments a message surface can wear.
 *
 * `underlined` is not among them: a message is a surface with an edge, not a rule under
 * a line of text, so the treatment an alert and a toast share excludes it.
 */
export type MessageVariant = Exclude<Variant, "underlined">;

/**
 * The treatment a message surface actually wears.
 *
 * A message has no underline treatment, but a consumer can set a global
 * `defaultVariant` of `underlined` for the components that do have one, and a renderer's
 * option can name any of the five. This is where the two meet: a message resolves the
 * one treatment it does not have into the nearest equivalent it does, rather than
 * rendering a treatment it cannot. Both renderers read this one rule, so they cannot
 * disagree about what a global default means for a message.
 *
 * @param variant - The treatment a tier resolved.
 * @returns The treatment a message surface can wear.
 *
 * @example
 * ```ts
 * resolveMessageVariant("underlined"); // "bordered"
 * resolveMessageVariant("faded"); // "faded"
 * ```
 */
export function resolveMessageVariant(variant: Variant): MessageVariant {
  return variant === "underlined" ? "bordered" : variant;
}
