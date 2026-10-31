/**
 * The web renderer's dictionaries for where a message appears and how it arrives.
 *
 * They were declared in `@asheeui/core`, in
 * `packages/core/src/components/feedback/toast/toast-styles.ts`, beside the platform's own strings
 * and beside `TOAST_TYPE_COLOR`. The line through that file is the role/drawing one: the type
 * colour map states a decision both renderers make and stayed in core, while these two are
 * drawings only a browser can compile.
 *
 * `PLACEMENT_CLASSES` anchors messages to a `fixed` viewport, which a device does not have — the
 * platform anchors with absolute insets instead (`NATIVE_TOAST_PLACEMENT_CLASS`).
 * `TOAST_ANIMATION_STATE` names keyframe animations a consumer's stylesheet defines; the platform
 * animates the same movement through its own driver. No name and no value changed in the move.
 *
 * Every entry is a complete, static class string: Tailwind compiles only the classes it can read
 * in the source.
 */

import type { ToastPlacement } from "@asheeui/core";

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
