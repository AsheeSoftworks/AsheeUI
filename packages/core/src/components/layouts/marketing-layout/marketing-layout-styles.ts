/**
 * Every class string the MarketingLayout renders, for both renderers, kept side by side so a
 * change to the composition's shape lands on both platforms at once. Every entry is a
 * complete, static class string, because both Tailwind and NativeWind compile the classes
 * they can read in the source.
 */

import type { MarketingLayoutBackground } from "./marketing-layout-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

/** The page shell: a full-height column of regions. */
export const MARKETING_LAYOUT_BASE_CLASS = "flex min-h-dvh w-full flex-col";

/** The background the composition paints behind its sections. */
export const MARKETING_LAYOUT_BACKGROUND_CLASS: Record<
  MarketingLayoutBackground,
  string
> = {
  default: "bg-background",
  muted: "bg-secondary/40",
};

/** The main region, which takes the height the header and footer leave. */
export const MARKETING_LAYOUT_MAIN_CLASS = "flex w-full flex-1 flex-col";

// ─── Native ───────────────────────────────────────────────────────────────────

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
