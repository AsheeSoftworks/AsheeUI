/**
 * The web renderer's class dictionaries for pagination.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/navigation/pagination/pagination-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Size } from "@asheeui/core";

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
