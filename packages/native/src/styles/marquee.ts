/**
 * The platform's class dictionaries for marquee.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/data-display/marquee/marquee-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { MarqueeAxis } from "@asheeui/core";

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
