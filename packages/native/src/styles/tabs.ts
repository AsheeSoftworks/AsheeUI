/**
 * The platform's class dictionaries for tabs.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/navigation/tabs/tabs-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { TabsVariant } from "@asheeui/core";

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
