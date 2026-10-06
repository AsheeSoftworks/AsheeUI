/**
 * Every class string the Pagination renders, for both renderers, kept side by side so a
 * change to the pattern's shape lands on both platforms at once. Every entry is a complete,
 * static class string, because both Tailwind and NativeWind compile the classes they can
 * read in the source.
 */

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

/** The treatment of a control the collection cannot act on. */
export const PAGINATION_DISABLED_CLASS =
  "opacity-50 pointer-events-none cursor-not-allowed";

// ─── Native ───────────────────────────────────────────────────────────────────

/**
 * The native collection footer.
 *
 * The web draws a numbered trail — the first and last page, the reader's neighbours and
 * gaps between them — because a browser has addresses to name. The platform's lists grow
 * instead: a reader reaches the end of what is loaded and the footer loads the next page,
 * which is why the footer states where the reader is and offers one control rather than
 * drawing a trail. It is a column, so the statement and the control stack.
 */
export const NATIVE_PAGINATION_BASE_CLASS =
  "w-full flex flex-col items-center gap-2";

/** The statement of where the reader is in the collection. */
export const NATIVE_PAGINATION_POSITION_CLASS = "text-center";
