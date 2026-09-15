/**
 * ErrorState component styles for AsheeUI.
 * This file provides the static class mappings for the failed-region
 * presentation: the disclosure that holds the technical detail and its body.
 */

/**
 * The disclosure.
 * It is the platform's own `details` element rather than a framework component,
 * because a detail a reader opens has to work when scripting is unavailable, and
 * because it is not application state.
 */
export const ERROR_STATE_DETAIL_CLASS =
  "w-full max-w-2xl text-left text-sm text-foreground/70";

/** The summary a reader activates to open the detail. */
export const ERROR_STATE_DETAIL_SUMMARY_CLASS =
  "cursor-pointer font-medium text-foreground";

/** The detail body, which keeps the technical text as it was written. */
export const ERROR_STATE_DETAIL_BODY_CLASS =
  "mt-2 overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-xs";
