/**
 * The web renderer's class dictionaries for avatar.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/data-display/avatar/avatar-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Size } from "@asheeui/core";

/**
 * CSS classes for the avatar's diameter based on size.
 */
export const AVATAR_SIZE_CLASS: Record<Size, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

/**
 * CSS classes for the initials' font size based on size.
 */
export const AVATAR_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * Base classes for the avatar frame.
 * The frame clips the picture to the resolved radius and centres a fallback.
 */
export const AVATAR_BASE_CLASS =
  "relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none font-medium uppercase";

/**
 * The classes the initials block carries, on the web.
 */
export const AVATAR_FALLBACK_CLASS =
  "inline-flex items-center justify-center size-full";
