/**
 * The clipboard pair's class strings, for both renderers.
 *
 * The pair draws no surface of its own — the copy control is the framework's `Button` —
 * so what this module holds is the one thing the pair states about itself: the region its
 * result is announced through. The result is a change of state rather than a change of
 * page, and a label that changes is not announced on either platform, so the announcement
 * is carried by a region of its own. On the web that region is visually hidden and stays in
 * the document, so the reader's focus never leaves the control they pressed and the change
 * is still announced.
 */

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * The status region a copy control announces its result through.
 * It is visually hidden and stays in the document, so the change is announced
 * without moving the reader's focus off the control they pressed.
 */
export const CLIPBOARD_STATUS_CLASS = "sr-only";

// ─── Native ───────────────────────────────────────────────────────────────────

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
