/**
 * The clipboard pair's class strings, for the web renderer.
 *
 * The pair draws no surface of its own — the copy control is the framework's `Button` —
 * so what this module holds is the one thing the pair states about itself: the region its
 * result is announced through. The result is a change of state rather than a change of
 * page, and a label that changes is not announced on either platform, so the announcement
 * is carried by a region of its own. On the web that region is visually hidden and stays in
 * the document, so the reader's focus never leaves the control they pressed and the change
 * is still announced.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * The status region a copy control announces its result through.
 * It is visually hidden and stays in the document, so the change is announced
 * without moving the reader's focus off the control they pressed.
 */
export const CLIPBOARD_STATUS_CLASS = "sr-only";

// ─── Native ───────────────────────────────────────────────────────────────────
