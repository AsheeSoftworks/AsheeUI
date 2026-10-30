/**
 * The PinInput's class dictionaries, for the web renderer.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones, side by
 * side: a box a character is typed into, and the group those boxes sit in, are the same
 * decisions on the web. The native scale is the larger of the two, because a code
 * is read back character by character and a box a thumb hits cannot be the size a pointer
 * aims at.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { PinInputSize } from "./pin-input-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

/** The group of boxes. */
export const PIN_INPUT_GROUP_CLASS = "flex flex-wrap items-center gap-2";

/** Shared base classes for a box. */
export const PIN_INPUT_BOX_CLASS =
  "border-2 text-center font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed";

/** Box density classes. */
export const PIN_INPUT_SIZE_CLASS: Record<PinInputSize, string> = {
  sm: "h-9 w-8 text-sm",
  md: "h-11 w-10 text-base",
  lg: "h-14 w-12 text-lg",
};

/** Box state: no error, not disabled. */
export const PIN_INPUT_BOX_DEFAULT_CLASS =
  "border-border bg-background text-foreground";

/** Box state: the value is invalid. */
export const PIN_INPUT_BOX_INVALID_CLASS =
  "border-danger bg-background text-foreground";

/** Box state: the field is disabled. */
export const PIN_INPUT_BOX_DISABLED_CLASS =
  "border-border bg-secondary/40 text-foreground/60";

/** The separator shown between groups of boxes. */
export const PIN_INPUT_SEPARATOR_CLASS = "px-1 text-foreground/40";

// ─── Native ───────────────────────────────────────────────────────────────────
