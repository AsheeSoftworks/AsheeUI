/**
 * The web renderer's class dictionaries for radius.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/shared/radius.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Radius } from "@asheeui/core";

/**
 * CSS class mapping for radius values.
 * Each radius option maps to the corresponding Tailwind rounded class.
 */
export const RADIUS_CLASS: Record<Radius, string> = {
  none: "rounded-none",
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};
