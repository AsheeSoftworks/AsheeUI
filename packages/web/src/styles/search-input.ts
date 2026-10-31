/**
 * The web renderer's class dictionaries for search-input.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/search-input/search-input-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Size } from "@asheeui/core";

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
