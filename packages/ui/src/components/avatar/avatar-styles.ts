/**
 * Avatar component styles for AsheeUI.
 * This file provides CSS class mappings for the Avatar component's diameter
 * and initials, plus the classes its frame is built from.
 */

import type { Size, Variant } from "../../shared";

/**
 * CSS classes for the avatar's diameter based on size.
 */
export const AVATAR_SIZE_CLASS: Record<Size, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

/**
 * CSS classes for the initials' font size based on size.
 */
export const AVATAR_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * Base classes for the avatar frame.
 * The frame clips the picture to the resolved radius and centres a fallback.
 */
export const AVATAR_BASE_CLASS =
  "relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none font-medium uppercase";

/**
 * The variant the initials fall back to.
 * An avatar shows an entity, so its fallback is a filled accent surface rather
 * than an outline or a tint.
 */
export const AVATAR_FALLBACK_VARIANT: Variant = "solid";
