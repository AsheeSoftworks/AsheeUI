/**
 * The web renderer's class dictionaries for alert.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/feedback/alert/alert-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { AlertType } from "@asheeui/core";

/**
 * Colour of the leading affordance for each intent.
 * It is decoration: the message text carries the information.
 */
export const ALERT_TYPE_ICON_CLASS: Record<AlertType, string> = {
  info: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-danger",
};

/** The alert surface and its content layout, on the web. */
export const ALERT_BASE_CLASS =
  "relative flex items-start gap-3 w-full p-3 text-sm transition-colors";

/** The icon slot, on the web. */
export const ALERT_ICON_CLASS = "shrink-0 mt-0.5 [&_svg]:size-5";

/**
 * The dismiss control, on the web.
 * It is a real button, so it is reachable by keyboard and carries the ring that
 * says where the keyboard is.
 */
export const ALERT_DISMISS_CLASS =
  "shrink-0 inline-flex items-center justify-center size-6 rounded-sm text-current/70 hover:text-current transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current";
