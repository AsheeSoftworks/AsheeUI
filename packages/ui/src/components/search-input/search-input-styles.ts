/**
 * SearchInput component styles for AsheeUI.
 * This file provides the static class mappings for the search field: the
 * landmark wrapper, the control that dismisses the text and the keyboard hint.
 */

import type { Size } from "../../shared";

/** The search region, which is announced as the page's search rather than a form. */
export const SEARCH_INPUT_REGION_CLASS = "relative w-full min-w-0";

/** The control that empties the field. */
export const SEARCH_INPUT_CLEAR_CLASS = "shrink-0";

/**
 * The keyboard hint.
 * It shows the shortcut a consumer has bound elsewhere; the field itself never
 * listens for it, because a global shortcut is an application concern.
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
