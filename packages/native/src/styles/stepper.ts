/**
 * The platform's class dictionaries for stepper.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/forms/stepper/stepper-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { Size, StepperOrientation, StepperStepState } from "@asheeui/core";

/**
 * The list, which is a column or a row.
 * Native has no breakpoints, so `responsive` is answered with the column: a phone is narrow,
 * and a stepper that reads in a row on a phone is a stepper of labels nobody can read.
 */
export const NATIVE_STEPPER_LIST_CLASS: Record<StepperOrientation, string> = {
  responsive: "w-full flex-col gap-4",
  horizontal: "w-full flex-row items-center gap-2",
  vertical: "w-full flex-col gap-4",
};

/** One step, which holds its marker and its text. */
export const NATIVE_STEPPER_ITEM_CLASS = "flex-row items-center gap-2";

/** The marker, which holds a number or a tick. */
export const NATIVE_STEPPER_MARKER_SIZE_CLASS: Record<Size, string> = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

/** Shared classes for the marker. */
export const NATIVE_STEPPER_MARKER_CLASS =
  "items-center justify-center rounded-full border";

/** The marker's treatment for each state. */
export const NATIVE_STEPPER_MARKER_STATE_CLASS: Record<
  StepperStepState,
  string
> = {
  complete: "border-success bg-success",
  current: "border-primary bg-primary",
  upcoming: "border-border bg-background",
};

/** The marker's text for each state, in the tone the surface it sits on asks for. */
export const NATIVE_STEPPER_MARKER_TEXT_CLASS: Record<
  StepperStepState,
  string
> = {
  complete: "text-background",
  current: "text-background",
  upcoming: "text-foreground/70",
};

/** The label of each step, and the tone that follows its state. */
export const NATIVE_STEPPER_LABEL_CLASS: Record<StepperStepState, string> = {
  complete: "text-base font-medium text-foreground",
  current: "text-base font-medium text-foreground",
  upcoming: "text-base font-medium text-foreground/60",
};

/** The marker's text size for each density. */
export const NATIVE_STEPPER_MARKER_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/** The description under a label. */
export const NATIVE_STEPPER_DESCRIPTION_CLASS = "text-sm text-foreground/60";

/** The column that holds a step's label above its description. */
export const NATIVE_STEPPER_TEXT_CLASS = "flex-col min-w-0";

/** The rule between two steps, which is drawn only in a row arrangement. */
export const NATIVE_STEPPER_CONNECTOR_CLASS: Record<
  StepperOrientation,
  string
> = {
  responsive: "",
  horizontal: "h-px flex-1 bg-border",
  vertical: "",
};
