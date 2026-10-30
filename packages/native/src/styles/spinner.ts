/**
 * The platform's class dictionaries for spinner.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/feedback/spinner/spinner-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { ColorRole, Size } from "@asheeui/core";

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
