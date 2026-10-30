/**
 * Every class string the Marquee renders, for the web renderer, kept side by side so a change
 * to the marquee's shape lands on the web at once. Every entry is a complete, static
 * class string, because both Tailwind and NativeWind compile the classes they can read in
 * the source.
 *
 * The component moves, and how it moves is what the two platforms state differently: the
 * web states a keyframe animation in its stylesheet, and the platform drives an animated
 * value from its own driver. What stays here is the dressing both share — the clipping
 * frame, the track, the sets and the items — and the two things only one platform can say.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
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

// ─── Native ───────────────────────────────────────────────────────────────────
