/**
 * The vocabulary a message surface shares: a treatment, and the rule that resolves one.
 *
 * An alert and a toast are the same kind of thing: a surface that carries a message in one of
 * the framework's colour roles. Both therefore ask the same question — what does a `faded`
 * surface in `danger` look like — and the *word* the answer is stated in has to be one word,
 * because a consumer who retunes the treatment of a message cannot be left with two components
 * that disagree about it.
 *
 * So `MessageVariant` and `resolveMessageVariant` are here rather than in a renderer. The first is
 * vocabulary the configuration is written in (H17); the second is a *rule*: a message has no
 * underline treatment, so a global `defaultVariant` of `underlined` resolves to `bordered` for one.
 * Both renderers read it, and a rule that lives in one renderer is a divergence waiting for the
 * other one to be written (H18).
 *
 * The *pictures* are each renderer's, and both have left core. The web draws a message through
 * `resolveVariantClass` in `packages/web/src/shared/variant.ts`; the platform's map is
 * `packages/native/src/styles/message-surface.ts`, because its utilities state a pressed state
 * rather than a hover state and its corner scale is its own. This module therefore holds no class
 * string and imports no renderer.
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
