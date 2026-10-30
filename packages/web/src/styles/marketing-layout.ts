/**
 * The web renderer's class dictionaries for marketing-layout.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/layouts/marketing-layout/marketing-layout-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { MarketingLayoutBackground } from "@asheeui/core";

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
