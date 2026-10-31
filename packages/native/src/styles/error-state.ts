/**
 * The platform's class dictionaries for error-state.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/feedback/error-state/error-state-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/** The native disclosure, which holds its own open and closed state. */
export const NATIVE_ERROR_STATE_DETAIL_CLASS = "w-full items-center gap-2";

/** The control a reader presses to open the detail on the platform. */
export const NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS = "items-center px-2 py-1";

/**
 * The native detail body.
 * It is a surface of its own, because a reader scrolling a stack trace on a phone
 * needs to see where the technical text starts and ends.
 */
export const NATIVE_ERROR_STATE_DETAIL_BODY_CLASS =
  "w-full rounded-md border border-border bg-background p-3";

/** The technical text itself, which stays monospaced on the platform too. */
export const NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS =
  "font-mono text-xs text-foreground/70";
