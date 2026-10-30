/**
 * The EmptyState's class dictionaries, for the web renderer.
 *
 * The tone of an empty region is a framework decision rather than a renderer's: the
 * badge behind the state's icon takes the tone's colour on the web, from one
 * map. What differs is the technology — the web sizes the badge with `size-*` and
 * the platform with explicit width and height, because a class the platform's
 * compiler cannot read produces no styling at all.
 *
 * Every entry is a complete, static class string, so nothing here is assembled at
 * runtime. The prefix says which renderer a constant belongs to: an unprefixed
 * `EMPTY_STATE_*` constant is the web renderer's, a `NATIVE_EMPTY_STATE_*` constant
 * is the native renderer's.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";
import type { EmptyStateType } from "./empty-state-config";

/** Inner arrangement of the state, on the web. */
export const EMPTY_STATE_CLASS = "flex flex-col items-center gap-4 text-center";

/** Padding of the state at each density, on the web. */
export const EMPTY_STATE_SIZE_CLASS: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-10",
};

/** The web panel treatment. */
export const EMPTY_STATE_PANEL_CLASS =
  "rounded-md border border-border bg-background";

/** The size of the badge that holds the state's icon, on the web. */
export const EMPTY_STATE_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

/**
 * The badge that holds the state's icon, coloured by tone, on the web.
 * Its text colour is what an icon drawn in `currentColor` takes.
 */
export const EMPTY_STATE_ICON_CLASS: Record<EmptyStateType, string> = {
  info: "flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary",
  success:
    "flex shrink-0 items-center justify-center rounded-full bg-success/10 text-success",
  warning:
    "flex shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning",
  error:
    "flex shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger",
};

// ─── Native ───────────────────────────────────────────────────────────────────
