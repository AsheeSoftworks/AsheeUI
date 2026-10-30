/**
 * The Marquee's one shared decision: how long a speed preset lasts.
 *
 * Everything else the Marquee renders is a class string or a number read by one renderer, and both
 * have left core. The web's class dictionaries — the clipping frame, the track, the sets, the fades,
 * the pause — moved to `packages/web/src/styles/marquee.ts` in C2; the platform's moved to
 * `packages/native/src/styles/marquee.ts` in C1, and `MARQUEE_FALLBACK_GAP` followed it there in
 * C3, because the platform is its only reader.
 *
 * `MARQUEE_SPEED_PRESETS` stays because both renderers read it and neither can state it for the
 * other: a preset is a *duration in seconds*, not a class, so it means the same thing to a CSS
 * animation and to a native animated value. It is one of the twelve shared constants
 * `CORE-MIGRATION-REPORT.md` §6.1 lists as a design decision rather than styling, and a marquee
 * that ran at one speed in a browser and another on a device would be a defect no test could see.
 */

import type { MarqueeSpeedPreset } from "./marquee-config";

/**
 * Duration in seconds for each speed preset.
 * Higher values mean slower animation.
 */
export const MARQUEE_SPEED_PRESETS: Record<MarqueeSpeedPreset, number> = {
  slow: 50,
  normal: 30,
  fast: 15,
};
