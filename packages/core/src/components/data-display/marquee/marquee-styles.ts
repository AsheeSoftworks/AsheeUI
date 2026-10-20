/**
 * Every class string the Marquee renders, for both renderers, kept side by side so a change
 * to the marquee's shape lands on both platforms at once. Every entry is a complete, static
 * class string, because both Tailwind and NativeWind compile the classes they can read in
 * the source.
 *
 * The component moves, and how it moves is what the two platforms state differently: the
 * web states a keyframe animation in its stylesheet, and the platform drives an animated
 * value from its own driver. What stays here is the dressing both share — the clipping
 * frame, the track, the sets and the items — and the two things only one platform can say.
 */

import type { MarqueeAxis, MarqueeSpeedPreset } from "./marquee-config";

// ─── Shared ───────────────────────────────────────────────────────────────────

/**
 * Duration in seconds for each speed preset.
 * Higher values mean slower animation.
 */
export const MARQUEE_SPEED_PRESETS: Record<MarqueeSpeedPreset, number> = {
  slow: 50,
  normal: 30,
  fast: 15,
};

/**
 * The gap the marquee falls back to when the configured one is a length the platform
 * cannot state. It is the framework's own default, which is what makes a value the
 * platform cannot read land on the value it would have had.
 */
export const MARQUEE_FALLBACK_GAP = 24;

// ─── Web ──────────────────────────────────────────────────────────────────────

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

// ─── Native ───────────────────────────────────────────────────────────────────

/** The native marquee frame. It clips what moves, which is what makes the loop seamless. */
export const NATIVE_MARQUEE_CLASS = "overflow-hidden";

/** The width or height the native frame claims, per axis. */
export const NATIVE_MARQUEE_AXIS_CLASS: Record<MarqueeAxis, string> = {
  x: "w-full",
  y: "h-full",
};

/**
 * The native track.
 * The web states its own width so the animation has something to translate; the platform
 * measures the content once it is laid out and translates by that measurement, because a
 * view is as wide as what it holds rather than as wide as a stylesheet says.
 */
export const NATIVE_MARQUEE_TRACK_CLASS = "flex";

/** The direction the native track takes, per axis. */
export const NATIVE_MARQUEE_TRACK_AXIS_CLASS: Record<MarqueeAxis, string> = {
  x: "flex-row",
  y: "flex-col",
};

/** A native set of items, which keeps its own size for the same reason the track does. */
export const NATIVE_MARQUEE_SET_CLASS = "flex shrink-0";

/** The direction a native set takes, per axis, so its own items line up along it. */
export const NATIVE_MARQUEE_SET_AXIS_CLASS: Record<MarqueeAxis, string> = {
  x: "flex-row",
  y: "flex-col",
};

/**
 * The frame a still native marquee reads in.
 *
 * With the movement stopped the content must not be clipped: it is rendered once, inside
 * a frame that scrolls, so everything that does not fit can still be read — the platform's
 * version of {@link MARQUEE_STILL_FRAME_CLASS}. The platform's `ScrollView` owns the
 * scrolling itself, so what is left here is the size the frame claims along each axis.
 */
export const NATIVE_MARQUEE_STILL_FRAME_CLASS: Record<MarqueeAxis, string> = {
  x: "w-full",
  y: "flex-1",
};

/**
 * The direction the single copy of a still native marquee takes.
 *
 * It wraps on the horizontal axis, because the items that would have scrolled past are
 * read in place instead of being left outside the frame; the vertical copy stacks for the
 * same reason the moving one does. The platform's `ScrollView` gives the wrapped rows the
 * scroll they need, which is why nothing here states an overflow.
 */
export const NATIVE_MARQUEE_STILL_SET_CLASS: Record<MarqueeAxis, string> = {
  x: "flex-row flex-wrap",
  y: "flex-col",
};

/** One native item, which keeps its own size rather than being squeezed. */
export const NATIVE_MARQUEE_ITEM_CLASS = "shrink-0";

/**
 * The pause the platform cannot honour.
 *
 * Pausing on hover is a pointer's gesture, and a touch screen has no pointer resting on
 * anything. The option is stated as an empty class rather than dropped, so a screen
 * configures one marquee for both platforms; what stops the motion here is the platform's
 * own way — the reader's motion preference, or `isAnimated` — and a screen that wants the
 * content to stand still asks for that rather than for a hover that never happens.
 */
export const NATIVE_MARQUEE_PAUSE_ON_HOVER_CLASS = "";

/**
 * The edge fade the platform cannot paint.
 *
 * The web paints a gradient over each edge. A gradient is a drawing, and the platform
 * paints one only through a drawing library this package does not depend on; a band of the
 * background colour would be a hard edge pretending to be a fade, which is a defect rather
 * than a substitution. The option still resolves through the shared contract, so one
 * configuration describes both platforms. The class is empty rather than absent for the
 * same reason the pause is.
 */
export const NATIVE_MARQUEE_FADE_CLASS = "";
