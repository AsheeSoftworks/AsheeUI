/**
 * The platform's class dictionaries for marketing-layout.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/layouts/marketing-layout/marketing-layout-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { MarketingLayoutBackground } from "@asheeui/core";

/**
 * The native composition.
 *
 * The web states a minimum height in viewport units, because a document page grows with what
 * it holds and has to be told not to be shorter than the window; a native screen is given its
 * height by the platform, and its page is the scrolling region itself, so the composition is
 * a scroller that fills the screen it was given.
 */
export const NATIVE_MARKETING_LAYOUT_CLASS = "flex-1 w-full";

/** The background the native composition paints behind its sections. */
export const NATIVE_MARKETING_LAYOUT_BACKGROUND_CLASS: Record<
  MarketingLayoutBackground,
  string
> = {
  default: "bg-background",
  muted: "bg-secondary/40",
};

/**
 * The scrolling content: the regions, in order.
 * The platform states the direction it means rather than relying on a default, exactly as
 * the page shell does.
 */
export const NATIVE_MARKETING_LAYOUT_CONTENT_CLASS = "flex w-full flex-col";

/** The main region, which holds the sections between the navigation and the footer. */
export const NATIVE_MARKETING_LAYOUT_MAIN_CLASS = "flex w-full flex-col";
