/**
 * The web renderer's class dictionaries for navbar.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/navigation/navbar/navbar-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { NavbarVariant } from "@asheeui/core";

/** Surface treatment classes. */
export const NAVBAR_VARIANT_CLASS: Record<NavbarVariant, string> = {
  solid: "bg-background",
  ghost: "bg-transparent",
  bordered: "bg-background border-b border-border",
};

/** Position classes. */
export const NAVBAR_POSITION_CLASS = "sticky top-0 z-20";

/** The bar's inner row. */
export const NAVBAR_INNER_CLASS = "flex w-full items-center gap-4 py-3";

/**
 * The brand region: the box the brand is laid out in.
 *
 * This is the wrapper's layout and nothing else. A brand that is a link gets its
 * typographic treatment from `NAVBAR_BRAND_TEXT_CLASS`, so the same layout classes are not
 * stated on two nested elements.
 */
export const NAVBAR_BRAND_CLASS = "flex shrink-0 items-center gap-2";

/**
 * The desktop list of destinations, next to the brand.
 *
 * A bar with more destinations than the row has room for has to give somewhere: the
 * list can shrink (`min-w-0`) and its links wrap onto a second line, so it degrades
 * instead of painting itself over the actions at the trailing edge.
 */
export const NAVBAR_LINKS_CLASS = "hidden min-w-0 items-center gap-1 md:flex";

/** The desktop link list, centred in the bar. */
export const NAVBAR_LINKS_CENTER_CLASS =
  "hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex";

/** The desktop link list, pushed to the trailing edge. */
export const NAVBAR_LINKS_END_CLASS =
  "hidden min-w-0 flex-1 items-center justify-end gap-1 md:flex";

/**
 * The row the desktop links are drawn in.
 *
 * They wrap rather than overflow, which is what keeps a crowded bar readable instead of
 * letting the links run over the action region.
 */
export const NAVBAR_LINK_LIST_CLASS =
  "flex min-w-0 flex-wrap items-center gap-1";

/** One navigation link. */
export const NAVBAR_LINK_CLASS =
  "rounded-xs px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary/60 hover:text-foreground";

/** The navigation link of the current page. */
export const NAVBAR_LINK_ACTIVE_CLASS = "bg-secondary/60 text-foreground";

/** The action region. */
export const NAVBAR_ACTIONS_CLASS = "ml-auto flex shrink-0 items-center gap-2";

/** The control that opens the mobile panel. */
export const NAVBAR_TOGGLE_CLASS = "ml-auto md:hidden";

/** The mobile panel, shown only on a narrow screen. */
export const NAVBAR_MOBILE_PANEL_CLASS =
  "flex flex-col gap-1 border-t border-border pb-3 pt-2 md:hidden";

/** The optional second row of the bar. */
export const NAVBAR_SECONDARY_CLASS = "w-full border-t border-border py-2";
