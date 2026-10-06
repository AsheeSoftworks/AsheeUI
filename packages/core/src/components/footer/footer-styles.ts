/**
 * The Footer's class dictionaries, for both renderers.
 *
 * A footer is a stack of regions — a brand column beside its navigation groups, and a lower
 * row that carries the copyright beside the legal and social links. The web turns the upper
 * region into a row at a breakpoint and the platform keeps it stacked and lets the groups
 * wrap, because the platform has one window: a footer that split its brand and its navigation
 * on a phone would leave neither enough room to read.
 *
 * The surfaces are one decision stated twice. `muted` and `bordered` are the same band and
 * the same separator on both platforms; only the transparency step differs, because the web
 * can let a page background show through a footer and the platform states the colour role
 * its surface takes.
 *
 * Every entry is a complete, static class string. An unprefixed `FOOTER_*` constant is the
 * web renderer's; `NATIVE_FOOTER_*` is the native renderer's.
 */

import type { FooterVariant } from "./footer-config";

/** Surface treatment classes, on the web. */
export const FOOTER_VARIANT_CLASS: Record<FooterVariant, string> = {
  solid: "bg-background",
  muted: "bg-secondary/50",
  bordered: "bg-background border-t border-border",
};

/** The upper region: the brand column beside the navigation groups, on the web. */
export const FOOTER_TOP_CLASS =
  "flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between";

/** The brand column, on the web. */
export const FOOTER_BRAND_COLUMN_CLASS = "flex max-w-sm flex-col gap-3";

/** The navigation groups, on the web. */
export const FOOTER_GROUPS_CLASS = "flex flex-wrap gap-10";

/** One navigation group, on the web. */
export const FOOTER_GROUP_CLASS = "flex min-w-32 flex-col gap-3";

/** A list inside the footer, on the web. */
export const FOOTER_LIST_CLASS = "flex flex-col gap-2";

/** One link inside the footer, on the web. */
export const FOOTER_LINK_CLASS =
  "text-sm text-foreground/70 transition-colors hover:text-foreground";

/** The lower region: copyright, legal links and social links, on the web. */
export const FOOTER_BOTTOM_CLASS =
  "mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between";

/** The legal and social link rows, on the web. */
export const FOOTER_BOTTOM_LINKS_CLASS = "flex flex-wrap items-center gap-4";

/** The row of icon links, on the web. */
export const FOOTER_SOCIAL_ROW_CLASS = "flex items-center gap-3";

// ─── Native ───────────────────────────────────────────────────────────────────

/** Surface treatment classes, on the platform. */
export const NATIVE_FOOTER_VARIANT_CLASS: Record<FooterVariant, string> = {
  solid: "bg-background",
  muted: "bg-secondary/40",
  bordered: "bg-background border-t border-border",
};

/** The upper region: the brand column above the navigation groups, on the platform. */
export const NATIVE_FOOTER_TOP_CLASS = "w-full gap-8";

/** The brand column, on the platform. */
export const NATIVE_FOOTER_BRAND_COLUMN_CLASS = "w-full gap-2";

/**
 * The navigation groups, on the platform.
 * They wrap into rows rather than keeping one column each, which is what a reader scrolling
 * a phone reads best.
 */
export const NATIVE_FOOTER_GROUPS_CLASS = "w-full flex-row flex-wrap gap-8";

/** One navigation group, on the platform. */
export const NATIVE_FOOTER_GROUP_CLASS = "gap-2";

/** A list inside the footer, on the platform. */
export const NATIVE_FOOTER_LIST_CLASS = "gap-1";

/** One link inside the footer, on the platform. */
export const NATIVE_FOOTER_LINK_CLASS = "text-sm text-foreground/70";

/** The lower region: copyright, legal links and social links, on the platform. */
export const NATIVE_FOOTER_BOTTOM_CLASS =
  "w-full mt-8 pt-4 border-t border-border gap-3";

/** The legal and social link rows, on the platform. */
export const NATIVE_FOOTER_BOTTOM_LINKS_CLASS =
  "flex-row flex-wrap items-center gap-4";

/** The row of icon links, on the platform. */
export const NATIVE_FOOTER_SOCIAL_ROW_CLASS = "flex-row items-center gap-3";
