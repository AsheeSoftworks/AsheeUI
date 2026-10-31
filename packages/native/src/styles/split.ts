/**
 * The platform's class dictionaries for split.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/layouts/split/split-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { SplitAlign, SplitRatio } from "@asheeui/core";

/** Shared classes for every native split. */
export const NATIVE_SPLIT_BASE_CLASS = "flex w-full";

/** The direction the panes take at each state, which the component resolves itself. */
export const NATIVE_SPLIT_DIRECTION_CLASS = {
  stacked: "flex-col",
  sideBySide: "flex-row",
} as const;

/** Cross-axis alignment classes for the panes. */
export const NATIVE_SPLIT_ALIGN_CLASS: Record<SplitAlign, string> = {
  start: "items-start",
  center: "items-center",
  stretch: "items-stretch",
};

/** The pane's classes while the panes are stacked, where each fills the width. */
export const NATIVE_SPLIT_PANE_STACKED_CLASS = "w-full";

/**
 * The share of the width each pane takes once the panes sit side by side.
 *
 * The division is the same as the web's — a half, or a third and two thirds — stated as
 * an explicit percentage rather than as a `flex-basis`, which is the same choice the
 * grid makes: the flex item keeps its default shrink, so the two panes and the gap
 * between them still add up to the width.
 */
export const NATIVE_SPLIT_PANE_WIDTH_CLASS: Record<
  SplitRatio,
  { start: string; end: string }
> = {
  equal: { start: "w-[50%]", end: "w-[50%]" },
  start: { start: "w-[66%]", end: "w-[33%]" },
  end: { start: "w-[33%]", end: "w-[66%]" },
};

/**
 * The rule between the panes.
 *
 * The web draws it with a `divide` utility that follows the flex direction; the
 * platform has no such utility, so the rule is stated on the second pane and which edge
 * it sits on is decided by the direction the component resolved.
 */
export const NATIVE_SPLIT_DIVIDER_STACKED_CLASS = "border-t border-border";

/** The rule between two side-by-side panes. */
export const NATIVE_SPLIT_DIVIDER_ROW_CLASS = "border-l border-border";

/**
 * The sticky treatment of the second pane.
 *
 * The platform has no scroll-linked positioning, so there is nothing for this class to
 * say; it is empty rather than absent so that `stickyEnd` remains a shared option that
 * a screen ignores rather than one it has to strip. A screen that must keep a pane in
 * view puts it in its own scrolling region.
 */
export const NATIVE_SPLIT_STICKY_CLASS = "";
