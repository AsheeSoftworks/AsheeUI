/**
 * The platform's class dictionaries for empty-state.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/feedback/empty-state/empty-state-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { EmptyStateType, Size } from "@asheeui/core";

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
