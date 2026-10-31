/**
 * The platform's class dictionaries for pagination.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/navigation/pagination/pagination-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

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
