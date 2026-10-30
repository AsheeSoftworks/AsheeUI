/**
 * The Tabs' class dictionaries, for the web renderer.
 *
 * A trigger's scale is shared: its height, its horizontal padding and its type size are
 * the framework's scale, so both renderers compile the same utilities. The bar itself is
 * not, because the two renderers reach a bar that does not fit differently: the web lets
 * the bar scroll horizontally as one flex row, and the platform scrolls it with its own
 * scroll view.
 *
 * The platform also states one thing the web does not need to: the smallest height a
 * trigger may be. A web trigger is sized for a pointer and a platform trigger is sized for
 * a thumb, and a control a thumb cannot reach is a defect rather than a style choice.
 *
 * Every entry is a complete, static class string. An unprefixed `TABS_*` constant is the
 * web renderer's; `NATIVE_TABS_*` is the native renderer's.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";

/** The height of a trigger at each density, on the web. */
export const TABS_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

/** The horizontal padding of a trigger at each density. */
export const TABS_PADDING_X_CLASS: Record<Size, string> = {
  sm: "px-2.5",
  md: "px-3.5",
  lg: "px-4",
};

/** The type size of a trigger at each density. */
export const TABS_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

// ─── Native ───────────────────────────────────────────────────────────────────
