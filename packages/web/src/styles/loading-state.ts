/**
 * The web renderer's class dictionaries for loading-state.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/feedback/loading-state/loading-state-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Size } from "@asheeui/core";

/** The loading region, which centres its indicator and its label, on the web. */
export const LOADING_STATE_CLASS =
  "flex w-full min-w-0 flex-col items-center justify-center gap-3 text-center";

/**
 * The web panel treatment, for a loading region inside a surface.
 * It carries no padding of its own: the density decides the room, so a panel and a
 * bare region of the same size agree.
 */
export const LOADING_STATE_PANEL_CLASS =
  "rounded-md border border-border bg-background";

/** Vertical padding for each density, on the web. */
export const LOADING_STATE_SIZE_CLASS: Record<Size, string> = {
  sm: "py-4",
  md: "py-8",
  lg: "py-12",
};
