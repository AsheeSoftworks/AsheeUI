/**
 * The web renderer's class dictionaries for stepper.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/stepper/stepper-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type {
  Size,
  StepperOrientation,
  StepperStepState,
  TypographySize,
} from "@asheeui/core";

/** The list, which is a column on a narrow screen and a row on a wide one. */
export const STEPPER_LIST_CLASS: Record<StepperOrientation, string> = {
  responsive:
    "flex w-full min-w-0 flex-col gap-4 md:flex-row md:items-center md:gap-2",
  horizontal: "flex w-full min-w-0 flex-row items-center gap-2",
  vertical: "flex w-full min-w-0 flex-col gap-4",
};

/** Shared classes for one step. */
export const STEPPER_ITEM_CLASS = "flex min-w-0 items-center gap-2";

/** The control a consumer can move between steps with. */
export const STEPPER_ITEM_BUTTON_CLASS =
  "flex min-w-0 items-center gap-2 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/** The marker, which holds a number or a tick. */
export const STEPPER_MARKER_SIZE_CLASS: Record<Size, string> = {
  sm: "size-6 text-xs",
  md: "size-8 text-sm",
  lg: "size-10 text-base",
};

/** Shared classes for the marker. */
export const STEPPER_MARKER_CLASS =
  "flex shrink-0 items-center justify-center rounded-full border font-medium";

/** The marker's treatment for each state. */
export const STEPPER_MARKER_STATE_CLASS: Record<StepperStepState, string> = {
  complete: "border-success bg-success text-background",
  current: "border-primary bg-primary text-background",
  upcoming: "border-border bg-background text-foreground/70",
};

/** The label of each step, and the tone that follows its state. */
export const STEPPER_LABEL_CLASS: Record<StepperStepState, string> = {
  complete: "font-medium text-foreground",
  current: "font-medium text-foreground",
  upcoming: "font-medium text-foreground/60",
};

/** The description under a label. */
export const STEPPER_DESCRIPTION_CLASS = "text-xs text-foreground/60";

/**
 * The rule between two steps.
 * It is drawn only in the row arrangement.
 */
export const STEPPER_CONNECTOR_CLASS: Record<StepperOrientation, string> = {
  responsive: "hidden h-px flex-1 bg-border md:block",
  horizontal: "hidden h-px flex-1 bg-border sm:block",
  vertical: "",
};

/** Visually hidden text that states a step's position for assistive technology. */
export const STEPPER_STATE_TEXT_CLASS = "sr-only";

/**
 * The typography size the step label takes for each density, on the web.
 *
 * The label is what names the step, so it scales with the marker beside it: a `lg` stepper whose
 * labels stayed at one size would be a larger badge with the same small text. The value is a
 * typography *token* rather than a class, so the label resolves through the shared typography scale
 * instead of stating a font size of its own.
 *
 * It is the web's, and moved here from `@asheeui/core` in C3. The platform answers the same question
 * with a *different* answer — `NATIVE_STEPPER_LABEL_ROLE` in
 * `packages/native/src/components/forms/stepper/stepper-styles.ts` names a role one step larger at
 * every density, because a native marker is a touch target rather than a badge — so there is no one
 * map both renderers could read, and a map only the web reads does not belong in core.
 */
export const STEPPER_LABEL_SIZE_TOKEN: Record<Size, TypographySize> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};
