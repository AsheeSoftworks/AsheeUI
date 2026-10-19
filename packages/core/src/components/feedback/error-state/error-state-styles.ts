/**
 * The ErrorState's class dictionaries, for both renderers.
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
 */

/** The web disclosure that holds the technical detail. */
export const ERROR_STATE_DETAIL_CLASS =
  "w-full max-w-2xl text-left text-sm text-foreground/70";

/** The web summary a reader activates to open the detail. */
export const ERROR_STATE_DETAIL_SUMMARY_CLASS =
  "cursor-pointer font-medium text-foreground";

/** The web detail body, which keeps the technical text as it was written. */
export const ERROR_STATE_DETAIL_BODY_CLASS =
  "mt-2 overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-xs";

// ─── Native ───────────────────────────────────────────────────────────────────

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
