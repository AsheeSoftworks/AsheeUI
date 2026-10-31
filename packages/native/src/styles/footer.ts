/**
 * The platform's class dictionaries for footer.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/navigation/footer/footer-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { FooterVariant } from "@asheeui/core";

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
