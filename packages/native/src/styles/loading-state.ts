/**
 * The platform's class dictionaries for loading-state.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/feedback/loading-state/loading-state-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { Size } from "@asheeui/core";

/** The loading region, which centres its indicator and its label, on the platform. */
export const NATIVE_LOADING_STATE_CLASS =
  "w-full flex-col items-center justify-center gap-3";

/**
 * The native panel treatment.
 * The corners come from the shared radius vocabulary rather than from this string,
 * so a panel here rounds the way every other native surface does.
 */
export const NATIVE_LOADING_STATE_PANEL_CLASS =
  "w-full border border-border bg-background";

/** Vertical padding for each density, on the platform. */
export const NATIVE_LOADING_STATE_SIZE_CLASS: Record<Size, string> = {
  sm: "py-4",
  md: "py-8",
  lg: "py-12",
};
