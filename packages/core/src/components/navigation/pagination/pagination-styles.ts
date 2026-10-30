/**
 * Every class string the Pagination renders, for the web renderer, kept side by side so a
 * change to the pattern's shape lands on the web at once. Every entry is a complete,
 * static class string, because both Tailwind and NativeWind compile the classes they can
 * read in the source.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * Base classes for the navigation landmark.
 */
export const PAGINATION_BASE_CLASS = "w-full";

/**
 * Classes for the ordered list that holds the page controls.
 */
export const PAGINATION_LIST_CLASS =
  "flex items-center flex-wrap list-none p-0 m-0 gap-1";

/**
 * Classes for a gap in the page range.
 * A gap conveys nothing on its own, so it is not focusable and not announced.
 */
export const PAGINATION_GAP_CLASS =
  "inline-flex items-center justify-center min-w-7 px-1 select-none text-foreground/60";

/** Classes shared by every page control, whether it is a link or a button. */
export const PAGINATION_CONTROL_CLASS =
  "inline-flex items-center justify-center min-w-8 h-8 px-2";

/**
 * The box of a page control rendered as a link, at each density.
 *
 * A link is not a `Button`, so it does not inherit the button size scale. These
 * entries restate the box the control occupies at each size, as complete class
 * strings, because a `Link` cannot be handed a size and have the box follow: the
 * link's own size map only covers type and gap. `md` repeats the shared control
 * box, so the default look is unchanged.
 */
export const PAGINATION_LINK_CONTROL_CLASS: Record<Size, string> = {
  sm: "min-w-7 h-7 px-1.5 text-xs",
  md: "min-w-8 h-8 px-2 text-sm",
  lg: "min-w-10 h-10 px-3 text-base",
};

/** The treatment of a control the collection cannot act on. */
export const PAGINATION_DISABLED_CLASS =
  "opacity-50 pointer-events-none cursor-not-allowed";

// ─── Native ───────────────────────────────────────────────────────────────────
