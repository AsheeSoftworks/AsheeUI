/**
 * The platform's class dictionaries for message-surface.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/shared/message-surface.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { Color, MessageVariant } from "@asheeui/core";

/**
 * The faded treatment, per colour role.
 * The default, and the one a message surface usually wants: a tint of the role's colour
 * with a border of the same hue, so the message is visible without competing with the
 * content beside it.
 */
const NATIVE_MESSAGE_FADED_CLASS: Record<Color, string> = {
  none: "border-transparent bg-secondary/40",
  primary: "border-primary/20 bg-primary/10",
  secondary: "border-secondary/30 bg-secondary/15",
  danger: "border-danger/20 bg-danger/10",
  warning: "border-warning/20 bg-warning/10",
  success: "border-success/20 bg-success/10",
};

/** The solid treatment, per colour role, which fills the surface. */
const NATIVE_MESSAGE_SOLID_CLASS: Record<Color, string> = {
  none: "border-transparent bg-background",
  primary: "border-transparent bg-primary",
  secondary: "border-transparent bg-secondary",
  danger: "border-transparent bg-danger",
  warning: "border-transparent bg-warning",
  success: "border-transparent bg-success",
};

/** The bordered treatment, per colour role, which outlines the surface. */
const NATIVE_MESSAGE_BORDERED_CLASS: Record<Color, string> = {
  none: "border-foreground/20 bg-transparent",
  primary: "border-primary bg-transparent",
  secondary: "border-secondary bg-transparent",
  danger: "border-danger bg-transparent",
  warning: "border-warning bg-transparent",
  success: "border-success bg-transparent",
};

/** The ghost treatment, per colour role, which is a tint with no outline. */
const NATIVE_MESSAGE_GHOST_CLASS: Record<Color, string> = {
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
  Record<Color, string>
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
  Record<Color, string>
> = {
  solid: {
    none: "text-foreground",
    primary: "text-on-solid",
    secondary: "text-foreground",
    danger: "text-on-solid",
    warning: "text-on-solid",
    success: "text-on-solid",
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
