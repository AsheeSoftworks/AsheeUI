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
 */

import type { ColorRole } from "../tokens";
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

/**
 * The faded treatment, per colour role.
 * The default, and the one a message surface usually wants: a tint of the role's colour
 * with a border of the same hue, so the message is visible without competing with the
 * content beside it.
 */
const NATIVE_MESSAGE_FADED_CLASS: Record<ColorRole, string> = {
  none: "border-transparent bg-secondary/40",
  primary: "border-primary/20 bg-primary/10",
  secondary: "border-secondary/30 bg-secondary/15",
  danger: "border-danger/20 bg-danger/10",
  warning: "border-warning/20 bg-warning/10",
  success: "border-success/20 bg-success/10",
};

/** The solid treatment, per colour role, which fills the surface. */
const NATIVE_MESSAGE_SOLID_CLASS: Record<ColorRole, string> = {
  none: "border-transparent bg-background",
  primary: "border-transparent bg-primary",
  secondary: "border-transparent bg-secondary",
  danger: "border-transparent bg-danger",
  warning: "border-transparent bg-warning",
  success: "border-transparent bg-success",
};

/** The bordered treatment, per colour role, which outlines the surface. */
const NATIVE_MESSAGE_BORDERED_CLASS: Record<ColorRole, string> = {
  none: "border-foreground/20 bg-transparent",
  primary: "border-primary bg-transparent",
  secondary: "border-secondary bg-transparent",
  danger: "border-danger bg-transparent",
  warning: "border-warning bg-transparent",
  success: "border-success bg-transparent",
};

/** The ghost treatment, per colour role, which is a tint with no outline. */
const NATIVE_MESSAGE_GHOST_CLASS: Record<ColorRole, string> = {
  none: "border-transparent bg-transparent",
  primary: "border-transparent bg-primary/10",
  secondary: "border-transparent bg-secondary/10",
  danger: "border-transparent bg-danger/10",
  warning: "border-transparent bg-warning/10",
  success: "border-transparent bg-success/10",
};

/**
 * Every treatment and colour role combination a native message surface can render.
 *
 * The treatments are the ones a message component's `variant` option names, so an
 * option a consumer can configure is an option the platform honours rather than one it
 * accepts and then ignores.
 */
export const NATIVE_MESSAGE_SURFACE_CLASS: Record<
  MessageVariant,
  Record<ColorRole, string>
> = {
  solid: NATIVE_MESSAGE_SOLID_CLASS,
  faded: NATIVE_MESSAGE_FADED_CLASS,
  bordered: NATIVE_MESSAGE_BORDERED_CLASS,
  ghost: NATIVE_MESSAGE_GHOST_CLASS,
};

/**
 * The text and glyph colour of each treatment, per colour role.
 *
 * A filled treatment needs it because its background carries the emphasis; the others
 * read the role's own colour on the theme's surface. The platform does not inherit a
 * container's text colour the way the web does, so the colour of the text is named
 * here rather than left to be inherited.
 */
export const NATIVE_MESSAGE_TEXT_CLASS: Record<
  MessageVariant,
  Record<ColorRole, string>
> = {
  solid: {
    none: "text-foreground",
    primary: "text-background",
    secondary: "text-foreground",
    danger: "text-background",
    warning: "text-background",
    success: "text-background",
  },
  faded: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
  bordered: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
  ghost: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
};
