/**
 * The Tooltip's class dictionaries, for both renderers.
 *
 * The scale is shared — a hint's padding and its type size are the framework's spacing and
 * typography — and so is the surface: a hint is a message surface, so it is drawn with the same
 * treatment and colour-role maps the alert and the toast read, which is what keeps a hint in
 * `danger` looking like every other message in `danger`.
 *
 * What the platform states for itself is where the hint goes. The web asks a positioning engine
 * for a coordinate; the platform measures its own trigger and places the hint at an edge of that
 * measurement, so what it needs is a direction and an alignment rather than a coordinate. The
 * anchor map says which direction and which alignment each placement resolves to, and it is
 * data rather than a branch in the component so that both can be read and tested.
 *
 * Every entry is a complete, static class string. An unprefixed `TOOLTIP_*` constant is the web
 * renderer's; `NATIVE_TOOLTIP_*` is the native renderer's.
 */

import type { TooltipPlacement, TooltipSizeKey } from "./tooltip-config";

/** The hint's horizontal padding, at each size. */
export const TOOLTIP_PADDING_X_CLASS: Record<TooltipSizeKey, string> = {
  sm: "px-2",
  md: "px-3",
  lg: "px-4",
};

/** The hint's vertical padding, at each size. */
export const TOOLTIP_PADDING_Y_CLASS: Record<TooltipSizeKey, string> = {
  sm: "py-1",
  md: "py-1.5",
  lg: "py-2",
};

/** The hint's type size, at each size. */
export const TOOLTIP_FONT_CLASS: Record<TooltipSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

// ─── Native ───────────────────────────────────────────────────────────────────

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
