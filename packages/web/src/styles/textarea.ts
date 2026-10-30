/**
 * The web renderer's class dictionaries for textarea.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/textarea/textarea-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { FieldSizeKey, FieldStatus } from "@asheeui/core";
import { FIELD_STATUS_BORDER_CLASS } from "./field";

/**
 * CSS classes for textarea padding and font size.
 * Maps size keys to Tailwind padding and text size classes.
 */
export const TEXTAREA_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "p-2 text-xs",
  md: "p-3 text-sm",
  lg: "p-4 text-base",
};

/**
 * CSS classes for textarea status border styles.
 * Maps status values to Tailwind classes for border and focus ring colours.
 */
export const TEXTAREA_STATUS_BORDER_CLASS: Record<FieldStatus, string> =
  FIELD_STATUS_BORDER_CLASS;
