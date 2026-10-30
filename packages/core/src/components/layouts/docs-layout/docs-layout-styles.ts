/**
 * Every class string the DocsLayout renders, for the web renderer, kept side by side so a change to
 * the composition's shape lands on the web at once. Every entry is a complete, static
 * class string, because both Tailwind and NativeWind compile the classes they can read in the
 * source.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * The page shell.
 * It wraps the application shell rather than replacing it, so the skip link can
 * be the first focusable element of the page.
 */
export const DOCS_LAYOUT_CLASS = "flex min-h-dvh w-full flex-col bg-background";

/** The application shell inside the page shell. */
export const DOCS_LAYOUT_SHELL_CLASS = "flex-1";

/**
 * The article column.
 * It is the region the skip link leads to, so it takes focus when the link is
 * followed.
 */
export const DOCS_LAYOUT_ARTICLE_CLASS = "flex w-full min-w-0 flex-col";

/**
 * The reading measure of the article body.
 * A documentation page is read rather than scanned, so the body keeps a readable
 * line length while the columns around it may be wider.
 */
export const DOCS_LAYOUT_BODY_CLASS = "flex flex-col gap-6 max-w-3xl";

/** The table of contents column. */
export const DOCS_LAYOUT_TOC_CLASS =
  "hidden w-full xl:block xl:w-64 xl:shrink-0";

/** Keeps the table of contents in view while the article scrolls. */
export const DOCS_LAYOUT_TOC_STICKY_CLASS = "xl:sticky xl:top-0 xl:self-start";

// ─── Native ───────────────────────────────────────────────────────────────────
