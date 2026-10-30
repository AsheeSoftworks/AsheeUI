/**
 * The web renderer's class dictionaries for spinner.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/feedback/spinner/spinner-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { ColorRole, Size } from "@asheeui/core";

/**
 * The classes every web spinner wears.
 *
 * The rotation is a CSS animation on a decoration, so the element is taken out of
 * the text flow and told never to shrink; both the size and the colour of the ring
 * come from the maps below, drawn in `currentColor`.
 *
 * The rotation is stated through the `motion-safe` variant rather than unconditionally,
 * because the skeleton's shimmer is: a reader who asked for reduced motion gets a still
 * ring on a status region that still says what is loading, which is the same answer the
 * placeholder gives. The label, not the movement, is what carries the wait.
 */
export const SPINNER_BASE_CLASS = "motion-safe:animate-spin shrink-0";

/**
 * The classes the web spinner's size resolves to.
 */
export const SPINNER_SIZE_CLASS: Record<Size, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

/**
 * The classes the web spinner's colour resolves to.
 *
 * The ring is drawn in `currentColor`, so the colour role is a text colour here.
 * `none` is the ink a filled surface paints its content in — the background token,
 * which is what a spinner over a solid surface matches — not an inherited colour.
 * A spinner that should take the surrounding text colour is given `text-current`
 * through `className`; nothing in this map inherits.
 */
export const SPINNER_COLOR_CLASS: Record<ColorRole, string> = {
  none: "text-background",
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};
