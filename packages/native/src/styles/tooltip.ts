/**
 * The platform's class dictionaries for tooltip.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/overlays/tooltip/tooltip-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { TooltipPlacement } from "@asheeui/core";

/**
 * Where each placement puts the hint on the platform.
 *
 * A side placement — beside a control — has nowhere to be on a screen a thumb is already
 * holding, so it resolves to the vertical direction its side reads from: a hint to the left of a
 * control comes *before* it, which on a vertical reading is above, and a hint to the right comes
 * after it, which is below. The alignment the placement asked for is kept, so a `-start` hint
 * still starts at the edge it was aligned to.
 */
export const NATIVE_TOOLTIP_ANCHOR: Record<
  TooltipPlacement,
  { direction: "above" | "below"; align: "start" | "center" | "end" }
> = {
  top: { direction: "above", align: "center" },
  "top-start": { direction: "above", align: "start" },
  "top-end": { direction: "above", align: "end" },
  bottom: { direction: "below", align: "center" },
  "bottom-start": { direction: "below", align: "start" },
  "bottom-end": { direction: "below", align: "end" },
  left: { direction: "above", align: "center" },
  "left-start": { direction: "above", align: "start" },
  "left-end": { direction: "above", align: "end" },
  right: { direction: "below", align: "center" },
  "right-start": { direction: "below", align: "start" },
  "right-end": { direction: "below", align: "end" },
};

/** How far the hint is aligned along the trigger's width. */
export const NATIVE_TOOLTIP_ALIGN_CLASS: Record<
  "start" | "center" | "end",
  string
> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

/**
 * The wrapper the hint and its trigger share.
 *
 * The platform places the hint against the trigger's own measurement, so the two have to be in
 * one view whose size the platform reports.
 */
export const NATIVE_TOOLTIP_WRAPPER_CLASS = "relative";

/** The layer the hint is drawn in, which spans the trigger's width. */
export const NATIVE_TOOLTIP_CONTAINER_CLASS = "absolute left-0 right-0";

/** The hint's surface, before its treatment is added. */
export const NATIVE_TOOLTIP_BUBBLE_CLASS = "border max-w-xs";

/** The pointer towards the trigger, which is a small square turned on its corner. */
export const NATIVE_TOOLTIP_ARROW_CLASS = "w-2 h-2 rotate-45";
