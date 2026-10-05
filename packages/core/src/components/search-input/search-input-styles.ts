/**
 * The SearchInput's class dictionaries, for both renderers.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones, side
 * by side: the region a search field occupies and the control that empties it are the same
 * decisions on both platforms, and stating the two beside each other is what keeps them
 * from drifting.
 *
 * What the web has and native does not is the keyboard hint: a shortcut a consumer has
 * bound elsewhere is shown beside a web field, where native has no keyboard to bind.
 */

import type { Size } from "../../tokens";

// ─── Web ──────────────────────────────────────────────────────────────────────

/** The search region, which is announced as the page's search rather than a form. */
export const SEARCH_INPUT_REGION_CLASS = "relative w-full min-w-0";

/** The control that empties the field. */
export const SEARCH_INPUT_CLEAR_CLASS = "shrink-0";

/**
 * The keyboard hint.
 * It shows the shortcut a consumer has bound elsewhere; the field itself never listens
 * for it, because a global shortcut is an application concern.
 */
export const SEARCH_INPUT_HINT_CLASS =
  "pointer-events-none shrink-0 rounded border border-border px-1.5 py-0.5 text-xs text-foreground/60";

/** Density of the hint, so it matches the field it sits in. */
export const SEARCH_INPUT_HINT_SIZE_CLASS: Record<Size, string> = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

/** Visually hidden label, for a field that is named but not captioned. */
export const SEARCH_INPUT_HIDDEN_LABEL_CLASS = "sr-only";

// ─── Native ───────────────────────────────────────────────────────────────────

/** The search region: the row the field and its controls sit in. */
export const NATIVE_SEARCH_INPUT_ROW_CLASS =
  "flex-row items-center gap-2 w-full min-w-0";

/** The field itself, which takes whatever room the controls beside it leave. */
export const NATIVE_SEARCH_INPUT_FIELD_CLASS = "flex-1 min-w-0";

/**
 * The control that empties the field.
 *
 * It is a pressable box rather than a glyph alone, because a control a thumb cannot hit is
 * a defect rather than a style choice; the platform's minimum touch target is what the
 * padding states.
 */
export const NATIVE_SEARCH_INPUT_CLEAR_CLASS =
  "shrink-0 items-center justify-center px-2 py-1";

/** The glyph the control draws, which is stated in the field's own colour role. */
export const NATIVE_SEARCH_INPUT_CLEAR_GLYPH_CLASS = "text-foreground/60";
