/**
 * Stepper styles for the native package.
 *
 * Most of the class strings live in `@asheeui/core`, beside the web ones, because a marker, the
 * label beside it and the rule between steps are the same decisions on both platforms. This
 * module holds the one decision the platform makes for itself: how large a step's label is.
 *
 * The shared label class states a fixed `text-base`, while the marker scales with `size`, so a
 * `lg` stepper was a larger badge with the same small text. The web replaced the fixed size with
 * `STEPPER_LABEL_SIZE_TOKEN` and resolves it into its typography role; the platform resolves the
 * same intent through its own roles, which is why the size is a role here rather than a class.
 */

import type { Size, StepperStepState, TypographyRole } from "@asheeui/core";

/**
 * The typography role a step's label takes at each density.
 *
 * The label is what names the step, so it scales with the marker beside it. The native scale is
 * the larger of the two — the marker is a touch target rather than a badge — so every step is one
 * role above the web's: the web's `md` resolves to its `sm` size, while the native `md` stays
 * `body-md`, which is the `text-base` the label has always rendered. `md` is therefore visually
 * unchanged and only `sm` and `lg` move.
 */
export const NATIVE_STEPPER_LABEL_ROLE: Record<Size, TypographyRole> = {
  sm: "body-sm",
  md: "body-md",
  lg: "body-lg",
};

/**
 * The tone a step's label takes in each state.
 *
 * The shared label class states a tone together with the size that is now the role's, so the
 * state contributes the tone alone: the current and past steps are foreground, and one that has
 * not started is muted, which is the same tone the web's label gives it.
 */
export const NATIVE_STEPPER_LABEL_TONE: Record<
  StepperStepState,
  "default" | "muted"
> = {
  complete: "default",
  current: "default",
  upcoming: "muted",
};

/**
 * The weight of a step's label.
 *
 * The native typography roles state a size and a leading, not a weight, so the label states the
 * medium weight the shared label class gives it. It keeps `md` exactly as it was and lets each
 * density change only the size the role resolves.
 */
export const NATIVE_STEPPER_LABEL_WEIGHT_CLASS = "font-medium";
