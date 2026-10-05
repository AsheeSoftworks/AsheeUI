/**
 * The Alert's class dictionaries, for both renderers.
 *
 * What is shared is the *meaning* of an intent, not the pixels: which colour role
 * it takes, and how urgently it is announced. Those maps are read by both
 * renderers, so a colour added to the design language or an urgency corrected
 * cannot reach one platform and miss the other.
 *
 * The class strings themselves are not unified, and deliberately so: the web draws
 * an alert with a live region, an icon drawn in SVG, and a hover state on its
 * dismiss control, and the platform draws one with an accessibility role, a text
 * glyph, and a pressed state. The prefix says which is which: an unprefixed
 * `ALERT_*` constant is the web renderer's, a `NATIVE_ALERT_*` constant is the
 * native renderer's, matching the way the rest of the framework names a platform's
 * own value.
 *
 * Every entry is a complete, static class string. Tailwind on the web and
 * NativeWind on native both compile the classes they can read in the source, so a
 * class assembled at runtime produces no styling at all; the maps are what keep
 * that from happening.
 */

import type { Color } from "../../shared/variant";
import type { AlertType } from "./alert-config";

/**
 * Colour each intent is presented in.
 * The colour resolves through the framework's colour engine, so an alert has no
 * palette colour of its own.
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

/**
 * The glyph the native alert shows for each intent.
 *
 * The web draws an icon; the native package ships no icon set, so its decoration is
 * a character, which is the same answer the framework's native stepper, picker and
 * calendar already give. A consumer who wants a drawing passes `icon`, and the
 * glyph is what stands in its place when they do not.
 */
export const NATIVE_ALERT_TYPE_GLYPH: Record<AlertType, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  error: "✕",
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

// ─── Native ───────────────────────────────────────────────────────────────────

/** Shared classes for every native alert. */
export const NATIVE_ALERT_BASE_CLASS =
  "flex-row items-start gap-3 w-full border p-3";

/** The native icon slot, which holds a glyph. */
export const NATIVE_ALERT_ICON_CLASS =
  "shrink-0 mt-0.5 items-center justify-center";

/** The glyph itself, which takes the intent's colour. */
export const NATIVE_ALERT_GLYPH_CLASS = "text-base font-semibold";

/** The block that keeps the title above its message. */
export const NATIVE_ALERT_BODY_CLASS =
  "flex-1 min-w-0 flex-col gap-0.5 opacity-90";

/** The title, which carries the emphasis of the message. */
export const NATIVE_ALERT_TITLE_CLASS = "font-medium";

/** The dismiss control, on the platform. */
export const NATIVE_ALERT_DISMISS_CLASS =
  "shrink-0 items-center justify-center rounded-md p-1";

/** The glyph inside the native dismiss control. */
export const NATIVE_ALERT_DISMISS_GLYPH_CLASS = "text-sm";
