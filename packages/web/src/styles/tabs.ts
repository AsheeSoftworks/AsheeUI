/**
 * The web renderer's class dictionaries for tabs.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/navigation/tabs/tabs-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Size } from "@asheeui/core";

/** The height of a trigger at each density, on the web. */
export const TABS_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};
