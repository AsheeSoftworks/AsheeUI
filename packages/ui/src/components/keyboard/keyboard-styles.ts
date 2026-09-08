/**
 * On-screen virtual keyboard styles for AsheeUI.
 * This file provides CSS class mappings for the keyboard's
 * size options, matching the Button component's sizing system.
 */

import type { Size } from "../../shared";

/**
 * CSS classes for keyboard height based on size.
 * Maps size keys to Tailwind height classes for the keyboard container.
 */
export const KEYBOARD_SIZE_CLASS: Record<Size, string> = {
  sm: "h-48 sm:h-56",
  md: "h-56 sm:h-64",
  lg: "h-64 sm:h-72",
};

/**
 * CSS classes for keyboard key sizes.
 * Maps size keys to Tailwind classes that control the font size
 * and padding of individual keys.
 */
export const KEYBOARD_KEY_SIZE_CLASS: Record<Size, string> = {
  sm: "text-xs gap-1",
  md: "text-sm sm:text-base gap-1.5",
  lg: "text-base sm:text-lg gap-2",
};
