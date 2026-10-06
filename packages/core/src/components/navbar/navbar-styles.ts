/**
 * Every class string the Navbar renders, for both renderers, kept side by side so a change to the
 * bar's shape lands on both platforms at once. Every entry is a complete, static class string,
 * because both Tailwind and NativeWind compile the classes they can read in the source.
 */

import type { NavbarAlign, NavbarVariant } from "./navbar-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

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

/** The brand region. */
export const NAVBAR_BRAND_CLASS =
  "flex shrink-0 items-center gap-2 font-semibold text-foreground";

/** The desktop link list, next to the brand. */
export const NAVBAR_LINKS_CLASS = "hidden items-center gap-1 md:flex";

/** The desktop link list, centred in the bar. */
export const NAVBAR_LINKS_CENTER_CLASS =
  "hidden flex-1 items-center justify-center gap-1 md:flex";

/** The desktop link list, pushed to the trailing edge. */
export const NAVBAR_LINKS_END_CLASS =
  "hidden flex-1 items-center justify-end gap-1 md:flex";

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

// ─── Native ───────────────────────────────────────────────────────────────────

/**
 * The native bar.
 *
 * The web's bar is a banner landmark with the page behind it; a platform screen has no banner
 * role, so the bar is the row it draws and says so rather than claiming a landmark it cannot be.
 */
export const NATIVE_NAVBAR_BASE_CLASS = "flex w-full flex-col";

/**
 * The surface each native variant is drawn as.
 *
 * The web's treatments are the same ones here; what a `ghost` bar leaves behind is the difference.
 * A browser shows the page through it, and the platform has no page behind a bar's own view, so a
 * transparent bar is drawn transparent and whatever the screen placed behind it is what shows.
 */
export const NATIVE_NAVBAR_VARIANT_CLASS: Record<NavbarVariant, string> = {
  solid: "bg-background",
  ghost: "bg-transparent",
  bordered: "bg-background border-b border-border",
};

/**
 * The native answer to a sticky bar.
 *
 * The platform has no scroll-linked positioning, so there is nothing for this class to say; it is
 * empty rather than absent, so `position` remains a shared option a screen ignores rather than one
 * it has to strip. A screen that must keep its bar in view places the bar outside its scrolling
 * region, which is the platform's own way of pinning one.
 */
export const NATIVE_NAVBAR_POSITION_CLASS = "";

/**
 * The bar's inner row.
 * The platform states the direction it means rather than relying on a default.
 */
export const NATIVE_NAVBAR_INNER_CLASS =
  "flex w-full flex-row items-center gap-4 py-3";

/** The brand region. */
export const NATIVE_NAVBAR_BRAND_CLASS =
  "flex shrink-0 flex-row items-center gap-2";

/**
 * The row of destinations, which is the platform's own tab bar.
 *
 * The web hides its row below `md` and offers a disclosure instead, because a browser's bar is a
 * single line it cannot scroll sideways. The platform keeps the row at every width and lets it
 * scroll, which is how a bar of more destinations than fit is presented on a screen, and states
 * the row as a tab list — the role the platform has for a bar of destinations — named with the
 * name the web gives its navigation landmark.
 */
export const NATIVE_NAVBAR_LINKS_CLASS = "flex-1";

/** The destinations themselves, laid out along the row. */
export const NATIVE_NAVBAR_LINKS_ROW_CLASS = "flex flex-row items-center gap-1";

/** Where the destinations sit inside the row they were given. */
export const NATIVE_NAVBAR_ALIGN_CLASS: Record<NavbarAlign, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

/** One destination. */
export const NATIVE_NAVBAR_LINK_CLASS = "px-3 py-2";

/** The destination of the current page. */
export const NATIVE_NAVBAR_LINK_ACTIVE_CLASS =
  "rounded-xs bg-secondary/60 font-medium";

/** The action region. */
export const NATIVE_NAVBAR_ACTIONS_CLASS =
  "ml-auto flex shrink-0 flex-row items-center gap-2";

/** The optional second row of the bar. */
export const NATIVE_NAVBAR_SECONDARY_CLASS =
  "flex w-full flex-col border-t border-border py-2";

/**
 * The native tab bar.
 *
 * The web states no separate tab bar, because its navigation is a row of links inside a banner.
 * The platform's navigation is a header and a bar of destinations, and that bar belongs at the edge
 * a thumb reaches rather than under the header, so the bar is offered on its own as well: the same
 * destinations and the same states, placed by the screen that owns the bottom edge.
 */
export const NATIVE_TAB_BAR_CLASS =
  "flex w-full flex-row items-center justify-around border-t border-border bg-background py-1";

/** One destination of the native tab bar. */
export const NATIVE_TAB_BAR_ITEM_CLASS =
  "flex flex-1 flex-col items-center gap-1 px-2 py-2";

/** The destination of the current screen, in the tab bar. */
export const NATIVE_TAB_BAR_ITEM_ACTIVE_CLASS = "bg-secondary/60";
