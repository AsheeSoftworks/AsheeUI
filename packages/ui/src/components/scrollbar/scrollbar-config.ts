/**
 * Scrollbar configuration for AsheeUI.
 * This file defines the structural (non-color) theming options for scrollbars.
 * Color properties (thumb/track) are handled separately through ColorVariant
 * in the theme system. This config controls shape, size, and behavior which
 * are theme-agnostic. It registers the default configuration with the
 * component registry for theme-level overrides.
 */

import { registerComponentDefaults } from "../../libs/registry";

/**
 * Structural (non-color) scrollbar theming.
 * Thumb/track colors already live in ColorVariant (scrollbarThumb/scrollbarTrack)
 * per theme - this config controls shape/behavior, which is theme-agnostic.
 */
export interface ScrollbarConfig {
  /**
   * Thickness of the scrollbar.
   * Applied via ::-webkit-scrollbar width and height properties.
   * Accepts any valid CSS size value (e.g., "10px", "0.5rem").
   */
  width: string;

  /**
   * Corner radius applied to the thumb.
   * Applied to both the thumb and track when trackRadius is not specified.
   * Accepts any valid CSS radius value.
   */
  radius: string;

  /**
   * Optional separate radius for the track.
   * When provided, overrides the radius for the track only.
   * Falls back to the main radius when omitted.
   */
  trackRadius?: string;

  /**
   * Creates an "inset" thumb look via a transparent border plus background-clip.
   * For example, "3px" gives the thumb 3px of breathing room from the track edge.
   * Accepts any valid CSS size value.
   */
  thumbBorder: string;

  /**
   * Native `scrollbar-gutter` value.
   * Reserves space for the scrollbar so content does not shift when a
   * scrollbar appears or disappears.
   *
   * - `auto`: No space is reserved.
   * - `stable`: Space is always reserved on the side where the scrollbar appears.
   * - `stable both-edges`: Space is reserved on both sides.
   */
  gutter: "auto" | "stable" | "stable both-edges";

  /**
   * Native `scrollbar-width` keyword fallback.
   * Used for engines that do not support the ::-webkit-scrollbar
   * pseudo-elements. Width properties are ignored in those engines.
   *
   * - `auto`: Default browser scrollbar width.
   * - `thin`: Thin scrollbar.
   * - `none`: No scrollbar visible.
   */
  fallbackWidth: "auto" | "thin" | "none";
}

/**
 * Default scrollbar configuration values.
 * Provides a modern, subtle scrollbar with rounded thumb and stable gutter.
 */
export const defaultScrollbarConfig: ScrollbarConfig = {
  width: "10px",
  radius: "9999px",
  thumbBorder: "3px",
  gutter: "stable",
  fallbackWidth: "thin",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    scrollbar: ScrollbarConfig;
  }
}

registerComponentDefaults("scrollbar", defaultScrollbarConfig);
