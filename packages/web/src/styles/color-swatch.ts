/**
 * The web renderer's class dictionaries for ColorSwatch.
 *
 * A swatch is a decision about a square: its size and its corner. Both are design-language
 * tokens, so each renderer states its own mapping rather than sharing a string core cannot
 * compile.
 */

import type { Size } from "@asheeui/core";

/** The shape every swatch keeps: a square block with a visible edge on a white surface. */
export const COLOR_SWATCH_BASE_CLASS =
  "inline-block shrink-0 border border-border/60";

/** One square per density step. */
export const COLOR_SWATCH_SIZE_CLASS: Record<Size, string> = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};
