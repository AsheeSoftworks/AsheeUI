/**
 * The web renderer's class dictionaries for clipboard.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/data-display/clipboard/clipboard-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

/**
 * The status region a copy control announces its result through.
 * It is visually hidden and stays in the document, so the change is announced
 * without moving the reader's focus off the control they pressed.
 */
export const CLIPBOARD_STATUS_CLASS = "sr-only";
