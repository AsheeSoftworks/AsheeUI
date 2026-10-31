/**
 * The Toast system's one shared answer: which colour role a type of message is presented in.
 *
 * A toast is mostly a drawing, and a drawing belongs to the renderer that compiles it. The web's
 * dictionaries — the viewport anchors and the keyframe animations each placement enters and exits
 * by — moved to `packages/web/src/styles/toast.ts` in C3; the platform's moved to
 * `packages/native/src/styles/toast.ts` in C1. What is left here is the part that is a decision
 * rather than a technology.
 *
 * `TOAST_TYPE_COLOR` stays because both renderers read it and both must answer the same way: a
 * message about a failure is presented in the danger role on either platform, because that is what
 * the type means rather than how a platform draws it. It maps a type to a *role* rather than to a
 * class string, which is what makes it shareable at all — `CORE-MIGRATION-REPORT.md` §6.1 lists it
 * among the twelve constants that are design decisions rather than styling.
 */

import type { Color } from "../../../shared/variant";
import type { ToastType } from "./toast-config";

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
