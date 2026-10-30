/**
 * The ErrorState's class dictionaries, for the web renderer.
 *
 * A failed region needs one thing the other states do not: somewhere to put the
 * technical detail, which is written for a developer and therefore belongs behind a
 * disclosure rather than in the open. The web uses the platform's own `details`
 * element, because a detail a reader opens has to work when scripting is
 * unavailable; the native renderer opens the same disclosure from local state, so the
 * behaviour is the same and only the mechanism differs.
 *
 * The detail's body keeps the technical text as it was written — a monospaced,
 * scrolled box — which is a decision about reading a stack trace rather than about a
 * platform, so both maps say it.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
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

// ─── Native ───────────────────────────────────────────────────────────────────
