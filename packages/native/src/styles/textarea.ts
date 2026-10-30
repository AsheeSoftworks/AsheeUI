/**
 * The platform's class dictionaries for textarea.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/forms/textarea/textarea-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { FieldSizeKey } from "@asheeui/core";

/**
 * The layout every native textarea starts from.
 *
 * It is not the single-line field's base: that one is a row which centres its text, and
 * a multi-line field has to fill its box from the top instead.
 */
export const NATIVE_TEXTAREA_BASE_CLASS = "w-full text-foreground";

/**
 * Padding and text size for each density.
 *
 * Height is deliberately absent: a native textarea's height comes from the rows it was
 * given, so a height here would be a second, competing statement of the same thing.
 */
export const NATIVE_TEXTAREA_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-5 py-4 text-lg",
};

/**
 * How tall one visible row is, in pixels.
 *
 * The platform's text metrics decide the real line height, so this is the framework's
 * reading of them rather than a measurement: it is the number the minimum height is
 * derived from, which is what makes `rows` mean the same thing on both platforms.
 */
export const NATIVE_TEXTAREA_ROW_HEIGHT = 24;
