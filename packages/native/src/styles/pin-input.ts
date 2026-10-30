/**
 * The platform's class dictionaries for pin-input.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/forms/pin-input/pin-input-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { PinInputSize } from "@asheeui/core";

/**
 * The group of boxes.
 * It is a row that wraps, because the boxes are one value read left to right.
 */
export const NATIVE_PIN_INPUT_GROUP_CLASS =
  "flex-row flex-wrap items-center gap-2 self-start";

/**
 * The box, which is a pressable surface the code is typed onto rather than a field per
 * character: the platform has one caret, so the field behind the boxes owns the value.
 */
export const NATIVE_PIN_INPUT_BOX_CLASS =
  "items-center justify-center border-2";

/** Box size for each density, sized for a thumb rather than for a pointer. */
export const NATIVE_PIN_INPUT_SIZE_CLASS: Record<PinInputSize, string> = {
  sm: "w-9 h-11",
  md: "w-11 h-14",
  lg: "w-14 h-16",
};

/** The character inside a box, which is read at the box's own scale. */
export const NATIVE_PIN_INPUT_FONT_CLASS: Record<PinInputSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

/** Box state: no error, not disabled. */
export const NATIVE_PIN_INPUT_BOX_DEFAULT_CLASS = "border-border bg-background";

/** Box state: the value is invalid. */
export const NATIVE_PIN_INPUT_BOX_INVALID_CLASS = "border-danger bg-background";

/** Box state: the field is disabled. */
export const NATIVE_PIN_INPUT_BOX_DISABLED_CLASS =
  "border-border bg-secondary/40";

/** The character shown inside a box. */
export const NATIVE_PIN_INPUT_VALUE_CLASS = "text-foreground";

/** The character shown inside a box that is unavailable. */
export const NATIVE_PIN_INPUT_VALUE_DISABLED_CLASS = "text-foreground/60";

/** The separator drawn between groups of boxes. */
export const NATIVE_PIN_INPUT_SEPARATOR_CLASS = "px-1 text-foreground/40";

/**
 * The field behind the boxes.
 *
 * It is the platform's own text field, and it is invisible: it holds the value, the caret
 * and the keyboard, while the boxes show what it holds. One field rather than one per
 * character is what the platform can do, because a native control has a single caret.
 */
export const NATIVE_PIN_INPUT_FIELD_CLASS = "absolute w-px h-px opacity-0";
