/**
 * The web renderer's class dictionaries for switch.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/switch/switch-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { SwitchSizeKey } from "@asheeui/core";

/**
 * CSS classes for switch track size.
 * Maps size keys to Tailwind width, height, and padding classes.
 */
export const SWITCH_TRACK_SIZE_CLASS: Record<SwitchSizeKey, string> = {
  sm: "w-8 h-4.5 p-0.5",
  md: "w-11 h-6 p-0.5",
  lg: "w-14 h-7.5 p-1",
};

/**
 * CSS classes for switch thumb size.
 * Maps size keys to Tailwind width and height classes.
 */
export const SWITCH_THUMB_SIZE_CLASS: Record<SwitchSizeKey, string> = {
  sm: "size-3.5",
  md: "size-5",
  lg: "size-5.5",
};

/**
 * CSS classes for switch thumb translation.
 * Maps size keys to Tailwind translate classes that control how far
 * the thumb moves when checked.
 */
export const SWITCH_THUMB_TRANSLATE_CLASS: Record<SwitchSizeKey, string> = {
  sm: "translate-x-3.5",
  md: "translate-x-5",
  lg: "translate-x-6",
};
