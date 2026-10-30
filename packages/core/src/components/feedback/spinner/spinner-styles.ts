/**
 * The Spinner's class dictionaries, for the web renderer.
 *
 * A class is not shared: the web asks the browser for a rotation and the platform
 * asks its own animator, so the two renderers wear different classes for the same
 * spinner. What is shared is the *map* — one entry per size, one entry per colour
 * role, for each platform — so a density or a colour role added to the design
 * language cannot reach one renderer and miss the other.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";
import type { ColorRole } from "../../../tokens";

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
