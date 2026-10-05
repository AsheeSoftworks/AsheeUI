/**
 * The Spinner's class dictionaries, for both renderers.
 *
 * A class is not shared: the web asks the browser for a rotation and the platform
 * asks its own animator, so the two renderers wear different classes for the same
 * spinner. What is shared is the *map* — one entry per size, one entry per colour
 * role, for each platform — so a density or a colour role added to the design
 * language cannot reach one renderer and miss the other.
 */

import type { Size } from "../../shared/radius";
import type { ColorRole } from "../../tokens";

/**
 * The classes every web spinner wears.
 *
 * The rotation is a CSS animation on a decoration, so the element is taken out of
 * the text flow and told never to shrink; both the size and the colour of the ring
 * come from the maps below, drawn in `currentColor`.
 */
export const SPINNER_BASE_CLASS = "animate-spin shrink-0";

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
 * `none` is the surface's own foreground, which is what a spinner over a filled
 * surface wants to inherit.
 */
export const SPINNER_COLOR_CLASS: Record<ColorRole, string> = {
  none: "text-background",
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

/**
 * The classes the native ring is built from.
 *
 * A native spinner cannot borrow the web's rotation: the platform animates with
 * its own animator, and the rotation is applied to the element as a transform
 * rather than as a class. What is left for a class is the ring itself — a round
 * border, one side of which is lit — which is why the highlight is a border side
 * rather than a second element.
 */
export const NATIVE_SPINNER_BASE_CLASS = "rounded-full border-2";

/**
 * The classes the native ring's size resolves to.
 *
 * The scale steps up from the web's: a spinner is seen at arm's length on a
 * phone rather than at a pointer's distance.
 */
export const NATIVE_SPINNER_SIZE_CLASS: Record<Size, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

/**
 * The track of the native ring — every side of the border but the lit one.
 */
export const NATIVE_SPINNER_TRACK_CLASS: Record<ColorRole, string> = {
  none: "border-foreground/25",
  primary: "border-primary/25",
  secondary: "border-secondary/25",
  danger: "border-danger/25",
  warning: "border-warning/25",
  success: "border-success/25",
};

/**
 * The lit side of the native ring, which is what makes a rotation visible.
 *
 * It is stated per colour role rather than derived from the track, because the two
 * classes are different utilities and a class assembled at runtime is never
 * compiled.
 */
export const NATIVE_SPINNER_HEAD_CLASS: Record<ColorRole, string> = {
  none: "border-t-foreground",
  primary: "border-t-primary",
  secondary: "border-t-secondary",
  danger: "border-t-danger",
  warning: "border-t-warning",
  success: "border-t-success",
};
