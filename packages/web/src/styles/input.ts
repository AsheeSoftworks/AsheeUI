/**
 * The web renderer's class dictionaries for input.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/input/input-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Size } from "@asheeui/core";

/**
 * Height, padding and text size for each density.
 * The web states a height rather than a minimum, since its scale is fixed by the
 * stylesheet rather than by the platform's font metrics.
 */
export const INPUT_SIZE_CLASS: Record<Size, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};
