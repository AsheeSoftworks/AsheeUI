/**
 * The Stepper's class dictionaries, for the web renderer.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones, side by
 * side: a marker, the label beside it and the rule drawn between steps are the same decisions
 * on the web. The native scale is the larger of the two, because a step marker is a
 * touch target when the steps are controls and a thumb-sized badge when they are not.
 *
 * A rule is drawn only in a row arrangement on both platforms: stacked, the order of the steps
 * and their states carry the sequence, and a rule would add noise rather than information.
 * The web states that per orientation with responsive variants; native states it per
 * orientation directly, because the platform has no breakpoints and the arrangement is
 * therefore whatever the consumer asked for.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { TypographySize } from "../../../shared/typography";
import type { Size } from "../../../tokens";
import type { StepperOrientation } from "./stepper-config";

/**
 * The state a step is in, relative to the current step.
 */
export type StepperStepState = "complete" | "current" | "upcoming";

// ─── Web ──────────────────────────────────────────────────────────────────────

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
 * The typography size the step label takes for each density.
 *
 * The label is what names the step, so it scales with the marker beside it: a
 * `lg` stepper whose labels stayed at one size would be a larger badge with the
 * same small text. The value is a typography *token* rather than a class, because
 * both renderers resolve it through the same typography scale instead of each
 * stating a font size.
 */
export const STEPPER_LABEL_SIZE_TOKEN: Record<Size, TypographySize> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

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

// ─── Native ───────────────────────────────────────────────────────────────────
