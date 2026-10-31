/**
 * The native renderer's class dictionaries for ColorSwatch.
 *
 * NativeWind compiles the same static strings; the dimensions are stated in its own unit.
 */

import type { Size } from "@asheeui/core";

/** The shape every swatch keeps: a square block with a visible edge on a white surface. */
export const NATIVE_COLOR_SWATCH_BASE_CLASS =
  "inline-block shrink-0 border border-border/60";

/** One square per density step. */
export const NATIVE_COLOR_SWATCH_SIZE_CLASS: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};
