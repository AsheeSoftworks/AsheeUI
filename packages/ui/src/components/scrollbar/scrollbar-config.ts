import { registerComponentDefaults } from "../../libs/registry";

/**
 * Structural (non-color) scrollbar theming.
 * Thumb/track colors already live in ColorVariant (scrollbarThumb/scrollbarTrack)
 * per theme - this config controls shape/behavior, which is theme-agnostic.
 */
export interface ScrollbarConfig {
  /** Thickness of the scrollbar. Applied via ::-webkit-scrollbar width/height. */
  width: string;
  /** Corner radius applied to the thumb (and track, if trackRadius isn't set). */
  radius: string;
  /** Optional separate radius for the track; falls back to `radius` when omitted. */
  trackRadius?: string;
  /**
   * Creates an "inset" thumb look via a transparent border + background-clip,
   * e.g. "3px" gives the thumb 3px of breathing room from the track edge.
   */
  thumbBorder: string;
  /**
   * Native `scrollbar-gutter` value - reserves space for the scrollbar so
   * content doesn't shift when a scrollbar appears/disappears.
   */
  gutter: "auto" | "stable" | "stable both-edges";
  /**
   * Native `scrollbar-width` keyword fallback for engines that don't support
   * the ::-webkit-scrollbar pseudo-elements (width/radius are ignored there).
   */
  fallbackWidth: "auto" | "thin" | "none";
}

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
