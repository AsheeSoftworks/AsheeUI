/**
 * Skeleton component styles for AsheeUI.
 * This file provides the static classes the Skeleton component is built from.
 */

/**
 * Base classes for the placeholder surface.
 * The surface colour resolves through the theme's secondary token, so the
 * placeholder follows the active theme.
 */
export const SKELETON_BASE_CLASS =
  "block h-4 w-full bg-secondary/60 select-none pointer-events-none";

/**
 * The shimmer.
 *
 * It is applied through the `motion-safe` variant rather than from a script, so
 * a consumer who asked for reduced motion sees a static placeholder and the
 * media query decides before hydration.
 */
export const SKELETON_ANIMATION_CLASS = "motion-safe:animate-pulse";
