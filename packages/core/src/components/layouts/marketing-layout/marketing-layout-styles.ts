/**
 * Every class string the MarketingLayout renders, for the web renderer, kept side by side so a
 * change to the composition's shape lands on the web at once. Every entry is a
 * complete, static class string, because both Tailwind and NativeWind compile the classes
 * they can read in the source.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
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
