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

/**
 * The state a step is in, relative to the current step.
 */
export type StepperStepState = "complete" | "current" | "upcoming";

// ─── Web ──────────────────────────────────────────────────────────────────────

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

// ─── Native ───────────────────────────────────────────────────────────────────
