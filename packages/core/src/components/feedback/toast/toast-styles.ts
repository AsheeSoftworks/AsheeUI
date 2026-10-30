/**
 * The Toast system's class dictionaries, for the web renderer.
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
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Color } from "../../../shared/variant";
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
