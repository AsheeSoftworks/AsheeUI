/**
 * The platform's class dictionaries for alert.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/feedback/alert/alert-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { AlertType } from "@asheeui/core";

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
