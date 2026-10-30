/**
 * The Tooltip's class dictionaries, for the web renderer.
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
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { TooltipSizeKey } from "./tooltip-config";

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
