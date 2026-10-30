/**
 * The web renderer's class dictionaries for docs-layout.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/layouts/docs-layout/docs-layout-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

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
