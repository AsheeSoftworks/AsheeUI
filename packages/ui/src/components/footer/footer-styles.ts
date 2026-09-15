/**
 * Footer component styles for AsheeUI.
 * This file provides the static class mappings for the Footer pattern.
 */

import type { FooterVariant } from "./footer-config";

/** Surface treatment classes. */
export const FOOTER_VARIANT_CLASS: Record<FooterVariant, string> = {
  solid: "bg-background",
  muted: "bg-secondary/50",
  bordered: "bg-background border-t border-border",
};

/** The upper region: the brand column beside the navigation groups. */
export const FOOTER_TOP_CLASS =
  "flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between";

/** The brand column. */
export const FOOTER_BRAND_COLUMN_CLASS = "flex max-w-sm flex-col gap-3";

/** The navigation groups. */
export const FOOTER_GROUPS_CLASS = "flex flex-wrap gap-10";

/** One navigation group. */
export const FOOTER_GROUP_CLASS = "flex min-w-32 flex-col gap-3";

/** A list inside the footer. */
export const FOOTER_LIST_CLASS = "flex flex-col gap-2";

/** One link inside the footer. */
export const FOOTER_LINK_CLASS =
  "text-sm text-foreground/70 transition-colors hover:text-foreground";

/** The lower region: copyright, legal links and social links. */
export const FOOTER_BOTTOM_CLASS =
  "mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between";

/** The legal and social link rows. */
export const FOOTER_BOTTOM_LINKS_CLASS = "flex flex-wrap items-center gap-4";

/** The row of icon links. */
export const FOOTER_SOCIAL_ROW_CLASS = "flex items-center gap-3";
