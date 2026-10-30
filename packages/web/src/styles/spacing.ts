/**
 * The web renderer's class dictionaries for spacing.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/shared/spacing.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Space } from "@asheeui/core";

/**
 * Horizontal padding classes for a page gutter.
 * Used by `Container`, where the gutter widens with the viewport.
 */
export const SPACE_PADDING_X_CLASS: Record<Space, string> = {
  none: "px-0",
  xs: "px-1",
  sm: "px-3",
  md: "px-4 sm:px-6",
  lg: "px-4 sm:px-6 lg:px-8",
  xl: "px-6 sm:px-8 lg:px-12",
  "2xl": "px-8 sm:px-12 lg:px-16",
};
