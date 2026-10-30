/**
 * The web renderer's class dictionaries for marquee.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/data-display/marquee/marquee-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { MarqueeAxis } from "@asheeui/core";

/** The marquee frame: it clips what moves and hides its own scrollbar. */
export const MARQUEE_CLASS = "group relative scrollbar-hide overflow-hidden";

/** The width or height the frame claims, per axis. */
export const MARQUEE_AXIS_CLASS: Record<MarqueeAxis, string> = {
  x: "w-full",
  y: "h-full",
};

/** The track the sets sit in: it is what moves. */
export const MARQUEE_TRACK_CLASS = "flex";

/**
 * The track's own width, which a horizontal marquee states so it can be translated.
 *
 * The track carries no `gap` of its own. A loop translates the track by half its length,
 * and with the gap on the track that half would be one copy plus half a gap rather than
 * one copy plus the gap that separates the copies — a seam that jumps every cycle. The
 * inter-copy gap therefore lives inside each copy (see `MARQUEE_SET_SPACING`), so the
 * track is exactly two copies and a half is exactly one copy plus the gap.
 */
export const MARQUEE_TRACK_X_CLASS = "flex-row w-max";

/** The direction a vertical track takes. */
export const MARQUEE_TRACK_Y_CLASS = "flex-col";

/**
 * The classes that stop the track while a pointer rests on the frame or keyboard focus is
 * inside it.
 *
 * `pauseOnHover` is named for the pointer, and WCAG 2.2.2 asks for a mechanism that stops
 * moving content for every reader: `focus-within` is the same pause for a keyboard user,
 * who stops the loop by focusing any control the marquee holds.
 */
export const MARQUEE_PAUSE_ON_HOVER_CLASS =
  "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]";

/** A set of items: one of the two copies the seamless loop is made of. */
export const MARQUEE_SET_CLASS = "flex shrink-0";

/**
 * The frame a still marquee reads in.
 *
 * With the loop stopped the content must not be clipped: it is shown once and the frame
 * can be scrolled to whatever did not fit. A wrapping horizontal frame is the common case;
 * the scroll is what makes a height-constrained frame or an item wider than the frame
 * reachable instead of silently cut off. `h-full` is what bounds the scroll when the frame
 * is given a height, and resolves to the content's own height when it is not.
 */
export const MARQUEE_STILL_FRAME_CLASS: Record<MarqueeAxis, string> = {
  x: "h-full overflow-auto",
  y: "h-full overflow-y-auto",
};

/**
 * The single copy a still marquee renders, which wraps on the horizontal axis so the items
 * that would have scrolled past are read in place rather than hidden.
 */
export const MARQUEE_STILL_SET_CLASS: Record<MarqueeAxis, string> = {
  x: "flex-row flex-wrap",
  y: "flex-col",
};

/** A set of items' direction, per axis. */
export const MARQUEE_SET_AXIS_CLASS: Record<MarqueeAxis, string> = {
  x: "flex-row",
  y: "flex-col",
};

/** One item in a set. An item keeps its own size rather than being squeezed. */
export const MARQUEE_ITEM_CLASS = "shrink-0";

/** The layer the fade gradients are painted in. */
export const MARQUEE_FADE_OVERLAY_CLASS = "absolute z-10 pointer-events-none";

/**
 * CSS classes for the start edge fade gradient.
 * Creates a fade effect at the beginning of the scroll direction.
 */
export const MARQUEE_FADE_START_CLASS: Record<MarqueeAxis, string> = {
  x: "top-0 left-0 h-full w-24 bg-linear-to-r from-background to-transparent",
  y: "top-0 left-0 w-full h-24 bg-linear-to-b from-background to-transparent",
};

/**
 * CSS classes for the end edge fade gradient.
 * Creates a fade effect at the end of the scroll direction.
 */
export const MARQUEE_FADE_END_CLASS: Record<MarqueeAxis, string> = {
  x: "top-0 -right-5 h-full w-24 bg-linear-to-l from-background to-transparent",
  y: "bottom-0 left-0 w-full h-24 bg-linear-to-t from-background to-transparent",
};

/**
 * The width or height a copy claims along the axis, at the end that faces the next copy.
 *
 * It is the marquee's gap, and it belongs to the copy rather than to the track so that one
 * copy's length already includes the space before the next one. The gap's value is a
 * configured CSS length, so the renderer states it as an inline style; what is here is the
 * direction it is stated in.
 */
export const MARQUEE_SET_SPACING: Record<
  MarqueeAxis,
  "paddingRight" | "paddingBottom"
> = {
  x: "paddingRight",
  y: "paddingBottom",
};
