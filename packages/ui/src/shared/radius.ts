/**
 * Size and radius type definitions for AsheeUI components.
 * This file defines the common size and radius types used across the component
 * library, along with utility functions for applying radius styles based on
 * component variants and states.
 */

import type { Variant } from ".";

/**
 * The available size options for components like Button, Input, and Spinner.
 * "sm" is small, "md" is medium (default), and "lg" is large.
 */
export type Size = "sm" | "md" | "lg";

/**
 * The available radius options for components.
 * These control the border-radius of elements, with "none" being square
 * corners and "full" creating circular or pill shapes.
 */
export type Radius = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";

/**
 * CSS class mapping for radius values.
 * Each radius option maps to the corresponding Tailwind rounded class.
 */
export const RADIUS_CLASS: Record<Radius, string> = {
  none: "rounded-none",
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

/**
 * Determines the appropriate radius to apply based on the component variant.
 * For underlined variants, the radius is forced to "none" because underlined
 * elements should not have rounded corners. For all other variants, the
 * provided radius is returned unchanged.
 *
 * @param variant - The component variant to check.
 * @param radius - The preferred radius value.
 * @returns The resolved radius, which will be "none" for underlined variants.
 *
 * @example
 * ```tsx
 * const radius = UnderlineRadius('underlined', 'lg');
 * // Returns "none" because underlined variants should not have rounded corners
 * ```
 *
 * @example
 * ```tsx
 * const radius = UnderlineRadius('solid', 'lg');
 * // Returns "lg" because solid variants can use the preferred radius
 * ```
 */
export const UnderlineRadius = (variant: Variant, radius: Radius): Radius => {
  if (variant === "underlined") {
    return "none";
  }
  return radius;
};
