/**
 * The platform's class dictionaries for avatar.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/data-display/avatar/avatar-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { Color, Size } from "@asheeui/core";

/**
 * The layout every native avatar starts from.
 * The frame clips the picture to the resolved radius and centres the fallback, which is
 * the web frame's job in the platform's vocabulary.
 */
export const NATIVE_AVATAR_BASE_CLASS =
  "flex-row items-center justify-center shrink-0 overflow-hidden";

/**
 * The diameter for each size, as the pair of classes the platform's compiler reads.
 */
export const NATIVE_AVATAR_SIZE_CLASS: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

/**
 * The initials' text size for each size, one step above the web's: a native label is
 * read at arm's length and has no page-zoom affordance beside it.
 */
export const NATIVE_AVATAR_FONT_CLASS: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

/**
 * The accent surface the initials fall back to, per colour role.
 */
export const NATIVE_AVATAR_FALLBACK_CLASS: Record<Color, string> = {
  none: "bg-background",
  primary: "bg-primary",
  secondary: "bg-secondary",
  danger: "bg-danger",
  warning: "bg-warning",
  success: "bg-success",
};

/**
 * The colour of the initials on that surface.
 * One value for every role, because a filled accent surface carries the framework's
 * foreground on both platforms.
 */
export const NATIVE_AVATAR_FALLBACK_TEXT_CLASS = "text-foreground";

/**
 * The classes the initials block carries, on the platform.
 * It fills the frame, so the initials are centred at every diameter.
 */
export const NATIVE_AVATAR_TEXT_BLOCK_CLASS =
  "h-full w-full items-center justify-center";

/**
 * The text treatment of the initials themselves, on the platform.
 * The web states this on the frame (`font-medium uppercase`); the platform states it on
 * the text, because its compiler reads a class on the element that carries it.
 */
export const NATIVE_AVATAR_INITIALS_CLASS = "font-medium text-center uppercase";
