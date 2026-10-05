/**
 * The Toast system's class dictionaries, for both renderers.
 *
 * Two of the maps here are read by both renderers, and they are the two that are
 * decisions rather than technology: which colour role a message's type is presented in,
 * and the scale a message is drawn at. A toast is a reading column — a width a sentence
 * fits in, the type size that sentence is read at — and that scale is the framework's
 * typography and spacing rather than a platform's, which is why both renderers compile
 * the same utility names from it.
 *
 * The rest is what each renderer has to say for itself. The web anchors its messages to
 * a viewport with `fixed` positioning and animates them through keyframe classes that
 * the consumer's stylesheet defines; the platform has no viewport and no keyframes, so
 * it anchors with absolute insets and animates with its own animator, which is why the
 * placement and animation maps are separate.
 *
 * Every entry is a complete, static class string: Tailwind on the web and NativeWind on
 * native both compile the classes they can read in the source.
 */

import type { Size } from "../../shared/radius";
import type { Color } from "../../shared/variant";
import type { ToastPlacement, ToastType } from "./toast-config";

/**
 * The colour role each type of message is presented in.
 *
 * A message about a failure is presented in the danger role on both platforms, because
 * that is what the type means rather than how a platform draws it.
 */
export const TOAST_TYPE_COLOR: Record<ToastType, Color> = {
  success: "success",
  error: "danger",
  warning: "warning",
  info: "primary",
  default: "secondary",
};

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

/** Width of a message at each density, which is the width a sentence fits in. */
export const TOAST_WIDTH_CLASS: Record<Size, string> = {
  sm: "w-72 max-w-full",
  md: "w-80 max-w-full",
  lg: "w-96 max-w-full",
};

/** Padding of a message at each density. */
export const TOAST_PADDING_CLASS: Record<Size, string> = {
  sm: "p-2.5",
  md: "p-3.5",
  lg: "p-4",
};

/** Type size of a message at each density. */
export const TOAST_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/** Type size and weight of a message's title at each density. */
export const TOAST_TITLE_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs font-semibold",
  md: "text-sm font-semibold",
  lg: "text-base font-semibold",
};

/**
 * Where the web anchors each placement.
 *
 * The container is `fixed`, so a placement is a corner or an edge of the viewport plus
 * the alignment its messages stack against.
 */
export const PLACEMENT_CLASSES: Record<ToastPlacement, string> = {
  "top-right": "top-0 right-0 items-end",
  "top-left": "top-0 left-0 items-start",
  "bottom-right": "bottom-0 right-0 items-end",
  "bottom-left": "bottom-0 left-0 items-start",
  "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
};

/**
 * The web's enter and exit animation for each placement.
 * Each class is a keyframe animation a consumer's stylesheet defines, rather than
 * something the framework can run: the web has no animator of its own here, and the
 * platform animates the same movement with its own.
 */
export const TOAST_ANIMATION_STATE: Record<
  ToastPlacement,
  { enter: string; exit: string }
> = {
  "top-right": {
    enter: "toast-enter-top-right",
    exit: "toast-exit-top-right",
  },
  "bottom-right": {
    enter: "toast-enter-bottom-right",
    exit: "toast-exit-bottom-right",
  },
  "top-left": {
    enter: "toast-enter-top-left",
    exit: "toast-exit-top-left",
  },
  "bottom-left": {
    enter: "toast-enter-bottom-left",
    exit: "toast-exit-bottom-left",
  },
  "top-center": {
    enter: "toast-enter-top-center",
    exit: "toast-exit-top-center",
  },
  "bottom-center": {
    enter: "toast-enter-bottom-center",
    exit: "toast-exit-bottom-center",
  },
};

// ─── Native ───────────────────────────────────────────────────────────────────

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
