/**
 * MarketingLayout component styles for AsheeUI.
 * This file provides the static class mappings for the marketing page
 * composition: the page shell, its background, its main region and the skip link
 * that leads to it.
 */

import type { MarketingLayoutBackground } from "./marketing-layout-config";

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
