/**
 * The web renderer's class dictionaries for pin-input.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/pin-input/pin-input-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { PinInputSize } from "@asheeui/core";

/** The group of boxes. */
export const PIN_INPUT_GROUP_CLASS = "flex flex-wrap items-center gap-2";

/** Shared base classes for a box. */
export const PIN_INPUT_BOX_CLASS =
  "border-2 text-center font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed";

/** Box density classes. */
export const PIN_INPUT_SIZE_CLASS: Record<PinInputSize, string> = {
  sm: "h-9 w-8 text-sm",
  md: "h-11 w-10 text-base",
  lg: "h-14 w-12 text-lg",
};

/** Box state: no error, not disabled. */
export const PIN_INPUT_BOX_DEFAULT_CLASS =
  "border-border bg-background text-foreground";

/** Box state: the value is invalid. */
export const PIN_INPUT_BOX_INVALID_CLASS =
  "border-danger bg-background text-foreground";

/** Box state: the field is disabled. */
export const PIN_INPUT_BOX_DISABLED_CLASS =
  "border-border bg-secondary/40 text-foreground/60";

/** The separator shown between groups of boxes. */
export const PIN_INPUT_SEPARATOR_CLASS = "px-1 text-foreground/40";
