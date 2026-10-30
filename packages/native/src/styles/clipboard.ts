/**
 * The platform's class dictionaries for clipboard.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/data-display/clipboard/clipboard-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/**
 * The status region a copy control announces its result through.
 *
 * The platform has no `sr-only` utility, and a view that is merely invisible is not
 * necessarily announced, so the region is kept in the layout as a pixel-sized, fully
 * transparent view: it stays in the accessibility tree, which is what makes the live region
 * reach a reader, while occupying no space a screen would notice.
 */
export const NATIVE_CLIPBOARD_STATUS_CLASS = "absolute w-px h-px opacity-0";

/**
 * The copy affordance of the native control.
 *
 * This package ships no icon set — the framework's native components draw their
 * affordances from characters, as the stepper's tick and the picker's check do — so the
 * two-joined-squares glyph stands in for the web's `CopyIcon`. A consumer who wants a
 * drawing passes `copyIcon` and this is what it replaces.
 */
export const NATIVE_CLIPBOARD_COPY_GLYPH = "⧉";

/**
 * The affordance the native control shows once the text is on the clipboard.
 * It is the framework's tick, the same character the stepper and the picker use to mean
 * done, and it stands in for the web's `CheckIcon`.
 */
export const NATIVE_CLIPBOARD_COPIED_GLYPH = "✓";
