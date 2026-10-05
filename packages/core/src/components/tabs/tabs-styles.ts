/**
 * The Tabs' class dictionaries, for both renderers.
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
 */

import type { Size } from "../../shared/radius";
import type { TabsVariant } from "./tabs-config";

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

/** The bar itself, on the platform, which is one row inside a scroll view. */
export const NATIVE_TABS_LIST_CLASS = "flex-row w-full items-center";

/**
 * The bar's treatment, per variant, on the platform.
 *
 * The web states these on the bar because the bar is a flex row that can scroll itself;
 * the platform states the gaps on the scroll view's content row, which is the element that
 * actually holds the triggers.
 */
export const NATIVE_TABS_VARIANT_LIST_CLASS: Record<TabsVariant, string> = {
  underline: "border-b border-border",
  bordered: "border border-border bg-background p-1",
  ghost: "",
};

/** The gap between triggers, per variant, on the platform's content row. */
export const NATIVE_TABS_VARIANT_CONTENT_CLASS: Record<TabsVariant, string> = {
  underline: "gap-2",
  bordered: "gap-1",
  ghost: "gap-1",
};

/**
 * Every native trigger, whatever its density.
 *
 * A trigger is a target a thumb reaches for, so it is never shorter than the shared touch
 * target; the density decides how much room it takes beyond that.
 */
export const NATIVE_TABS_TRIGGER_CLASS = "min-h-[44px]";

/** The region a selected tab reveals. */
export const NATIVE_TABS_PANEL_CLASS = "w-full";
