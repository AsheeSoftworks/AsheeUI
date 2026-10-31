/**
 * The Alert's two shared decisions: which colour role an intent takes, and how urgently it is
 * announced.
 *
 * What is shared is the *meaning* of an intent, not the pixels. An alert about a failure is
 * presented in the danger role on both platforms, and it interrupts a screen reader on both,
 * because that is what the intent means rather than how a platform draws it. Both renderers read
 * both maps, so a colour added to the design language or an urgency corrected cannot reach one
 * platform and miss the other. They are two of the twelve shared constants
 * `CORE-MIGRATION-REPORT.md` §6.1 lists as design decisions rather than styling.
 *
 * The class strings are not shared, and deliberately so: the web draws an alert with a live region,
 * an icon drawn in SVG, and a hover state on its dismiss control, and the platform draws one with an
 * accessibility role, a text glyph, and a pressed state. Each renderer keeps its own — the web's in
 * `packages/web/src/styles/alert.ts`, the platform's in `packages/native/src/styles/alert.ts` — and
 * both left core in C2 and C1.
 */

import type { Color } from "../../../shared/variant";
import type { AlertType } from "./alert-config";

/**
 * Colour each intent is presented in.
 * The colour resolves through the framework's colour engine, so an alert has no
 * palette colour of its own. Both renderers read this one map, which is why a role
 * added to the design language reaches both or neither.
 */
export const ALERT_TYPE_COLOR: Record<AlertType, Color> = {
  info: "primary",
  success: "success",
  warning: "warning",
  error: "danger",
};

/**
 * How urgently each intent is announced.
 * `alert` interrupts what assistive technology is reading, so it is reserved for
 * the two intents that need attention now. Native announces through
 * `accessibilityRole`, which is the platform's name for the same two levels.
 */
export const ALERT_TYPE_ROLE: Record<AlertType, "alert" | "status"> = {
  info: "status",
  success: "status",
  warning: "alert",
  error: "alert",
};
