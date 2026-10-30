/**
 * The web renderer's class dictionaries for empty-state.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/feedback/empty-state/empty-state-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { EmptyStateType, Size } from "@asheeui/core";

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
