/**
 * The EmptyState's class dictionaries, for both renderers.
 *
 * The tone of an empty region is a framework decision rather than a renderer's: the
 * badge behind the state's icon takes the tone's colour on both platforms, from one
 * map. What differs is the technology — the web sizes the badge with `size-*` and
 * the platform with explicit width and height, because a class the platform's
 * compiler cannot read produces no styling at all.
 *
 * Every entry is a complete, static class string, so nothing here is assembled at
 * runtime. The prefix says which renderer a constant belongs to: an unprefixed
 * `EMPTY_STATE_*` constant is the web renderer's, a `NATIVE_EMPTY_STATE_*` constant
 * is the native renderer's.
 */

import type { Size } from "../../shared/radius";
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

/** Inner arrangement of the state, on the platform. */
export const NATIVE_EMPTY_STATE_CLASS =
  "flex-col items-center justify-center gap-3 w-full";

/** Padding of the state at each density, on the platform. */
export const NATIVE_EMPTY_STATE_SIZE_CLASS: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-10",
};

/**
 * The native panel treatment.
 * The corners are the framework's panel corners, which the web states the same way:
 * a state drawn as a panel is a surface, and a surface rounds the same on both
 * platforms.
 */
export const NATIVE_EMPTY_STATE_PANEL_CLASS =
  "w-full rounded-md border border-border bg-background";

/**
 * The size of the badge that holds the state's icon, on the platform.
 * The web writes these as `size-8`; the platform states the width and the height,
 * which is the spelling its compiler reads.
 */
export const NATIVE_EMPTY_STATE_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

/** The native badge behind the state's icon, coloured by tone. */
export const NATIVE_EMPTY_STATE_ICON_CLASS: Record<EmptyStateType, string> = {
  info: "items-center justify-center rounded-full bg-primary/10",
  success: "items-center justify-center rounded-full bg-success/10",
  warning: "items-center justify-center rounded-full bg-warning/10",
  error: "items-center justify-center rounded-full bg-danger/10",
};

/**
 * The colour of the native badge's glyph, per tone.
 *
 * The web's badge carries the colour for the icon to inherit; a character on the
 * platform states its own, so the tone is named a second time here rather than
 * inherited. The two maps are kept side by side so they cannot drift.
 */
export const NATIVE_EMPTY_STATE_ICON_TEXT_CLASS: Record<
  EmptyStateType,
  string
> = {
  info: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-danger",
};

/** The row that holds the state's actions, on the platform. */
export const NATIVE_EMPTY_STATE_ACTIONS_CLASS =
  "flex-row flex-wrap items-center justify-center gap-2";

/**
 * The block that keeps the state's heading above its description, on the platform.
 * The web states this spacing inside its section heading; the platform states it
 * here, because the two lines are two text styles rather than one component.
 */
export const NATIVE_EMPTY_STATE_HEADING_CLASS = "items-center gap-1";
