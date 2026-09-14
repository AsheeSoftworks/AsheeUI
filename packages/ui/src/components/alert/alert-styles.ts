/**
 * Alert component styles for AsheeUI.
 * This file provides the static class mappings the Alert component is built
 * from: the colour and announcement urgency each intent maps to, and the
 * classes for its structure.
 */

import type { Color } from "../../shared";
import type { AlertType } from "./alert-config";

/**
 * Colour each intent is presented in.
 * The colour resolves through the framework's colour engine, so an alert has
 * no palette colour of its own.
 */
export const ALERT_TYPE_COLOR: Record<AlertType, Color> = {
  info: "primary",
  success: "success",
  warning: "warning",
  error: "danger",
};

/**
 * How urgently each intent is announced.
 * `alert` interrupts what assistive technology is reading, so it is reserved
 * for the two intents that need attention now.
 */
export const ALERT_TYPE_ROLE: Record<AlertType, "alert" | "status"> = {
  info: "status",
  success: "status",
  warning: "alert",
  error: "alert",
};

/**
 * Colour of the leading icon for each intent.
 * The icon is decoration: the message text carries the information.
 */
export const ALERT_TYPE_ICON_CLASS: Record<AlertType, string> = {
  info: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-danger",
};

/**
 * Base classes for the alert surface and its content layout.
 */
export const ALERT_BASE_CLASS =
  "relative flex items-start gap-3 w-full p-3 text-sm transition-colors";

/**
 * Classes for the icon slot.
 */
export const ALERT_ICON_CLASS = "shrink-0 mt-0.5 [&_svg]:size-5";

/**
 * Classes for the dismiss control.
 */
export const ALERT_DISMISS_CLASS =
  "shrink-0 inline-flex items-center justify-center size-6 rounded-sm text-current/70 hover:text-current transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current";
