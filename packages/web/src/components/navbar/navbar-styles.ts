/**
 * Navbar component styles for AsheeUI.
 * This file provides the static class mappings for the Navbar pattern: the bar's
 * surface, its position, its regions and its links.
 */

import type { NavbarVariant } from "./navbar-config";

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
