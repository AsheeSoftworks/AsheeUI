/**
 * The web renderer's class dictionaries for error-state.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/feedback/error-state/error-state-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

/** The web disclosure that holds the technical detail. */
export const ERROR_STATE_DETAIL_CLASS =
  "w-full max-w-2xl text-left text-sm text-foreground/70";

/**
 * The web summary a reader activates to open the detail.
 *
 * It is the only focusable element the state draws, so it draws the library's ring
 * like every other control: a browser's own outline would make the failure the one
 * surface whose focus treatment depended on the browser.
 */
export const ERROR_STATE_DETAIL_SUMMARY_CLASS =
  "cursor-pointer rounded-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/** The web detail body, which keeps the technical text as it was written. */
export const ERROR_STATE_DETAIL_BODY_CLASS =
  "mt-2 overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-xs";
