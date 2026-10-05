/**
 * Marquee component styles for AsheeUI.
 * This file provides CSS class mappings for the Marquee component's
 * speed presets and edge fade effects.
 */

import type { MarqueeAxis, MarqueeSpeedPreset } from "./marquee-config";

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
