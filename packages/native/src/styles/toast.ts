/**
 * The platform's class dictionaries for toast.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/feedback/toast/toast-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { ToastPlacement, ToastType } from "@asheeui/core";

/**
 * The glyph a native message shows for each type.
 * The web draws an icon; the platform ships no icon set and draws a character, as the
 * framework's native alert, stepper and picker already do.
 */
export const NATIVE_TOAST_TYPE_GLYPH: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
  default: "•",
};

/**
 * Where the platform anchors each placement.
 *
 * The layer is absolute rather than fixed — the platform has no viewport to be fixed
 * to — and the container spans the screen's width, so a centred placement is centred by
 * the row's alignment rather than by a transform.
 */
export const NATIVE_TOAST_PLACEMENT_CLASS: Record<ToastPlacement, string> = {
  "top-right": "top-0 right-0 items-end",
  "top-left": "top-0 left-0 items-start",
  "bottom-right": "bottom-0 right-0 items-end",
  "bottom-left": "bottom-0 left-0 items-start",
  "top-center": "top-0 left-0 right-0 items-center",
  "bottom-center": "bottom-0 left-0 right-0 items-center",
};

/**
 * The layer the platform stacks its messages in.
 *
 * It carries no pointer handling of its own: the layer is `box-none`, so a press
 * reaches the message under it and passes through everywhere else.
 */
export const NATIVE_TOAST_CONTAINER_CLASS =
  "absolute flex-col gap-3 p-4 max-h-full";

/**
 * Base classes for a native message surface.
 *
 * The treatment and the colour role come from the shared message-surface maps, so a
 * toast is drawn the way the framework's other message surfaces are; what is here is
 * the arrangement — a row, with the glyph beside the text.
 */
export const NATIVE_TOAST_BASE_CLASS = "flex-row items-start gap-3 border";

/** The block that keeps a message's title above its body. */
export const NATIVE_TOAST_BODY_CLASS = "flex-1 min-w-0 flex-col gap-0.5";

/** The slot a message's glyph sits in. */
export const NATIVE_TOAST_ICON_CLASS = "shrink-0 pt-0.5";

/** The dismiss control on the platform. */
export const NATIVE_TOAST_DISMISS_CLASS = "shrink-0 rounded-md p-1";

/** The row that holds a message's action. */
export const NATIVE_TOAST_ACTION_CLASS = "mt-2 flex-row items-center gap-2";
