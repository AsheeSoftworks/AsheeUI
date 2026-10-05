/**
 * Variant style definitions for AsheeUI components.
 * This file contains the complete style mappings for different button variants
 * (solid, ghost, bordered, faded, underlined) and colors. It provides the
 * resolveVariantClass function that components use to apply the correct
 * visual styles based on their variant and color props.
 */

import { cn } from "../utils";

/**
 * The available visual styles for components like Button.
 * Each variant represents a distinct visual treatment with different
 * background, border, and hover behaviors.
 */
export type Variant = "solid" | "ghost" | "bordered" | "faded" | "underlined";

/**
 * The available color options for themed components.
 * "none" represents a neutral or default color treatment.
 */
export type Color =
  | "none"
  | "primary"
  | "secondary"
  | "danger"
  | "warning"
  | "success";

/**
 * Base transition styles applied to all variant classes.
 * Provides consistent animation timing and easing for hover states.
 */
const TRANSITION = "transition-all duration-200 ease-in-out";

/**
 * CSS classes for the "solid" variant.
 * Solid buttons have filled backgrounds with text on top, using the full color.
 */
const SOLID_CLASS: Record<Color, string> = {
  none: cn(TRANSITION, "bg-background text-foreground hover:bg-background/80"),
  primary: cn(TRANSITION, "bg-primary text-foreground hover:bg-primary/80"),
  secondary: cn(
    TRANSITION,
    "bg-secondary text-foreground hover:bg-secondary/80",
  ),
  danger: cn(TRANSITION, "bg-danger text-foreground hover:bg-danger/80"),
  warning: cn(TRANSITION, "bg-warning text-foreground hover:bg-warning/80"),
  success: cn(TRANSITION, "bg-success text-foreground hover:bg-success/80"),
};

/**
 * CSS classes for the "ghost" variant.
 * Ghost buttons have transparent backgrounds with colored text,
 * and show a subtle background on hover.
 */
const GHOST_CLASS: Record<Color, string> = {
  none: cn(
    TRANSITION,
    "bg-transparent text-foreground hover:bg-foreground/20 hover:text-foreground",
  ),
  primary: cn(
    TRANSITION,
    "bg-transparent text-primary hover:bg-primary/20 hover:text-primary",
  ),
  secondary: cn(
    TRANSITION,
    "bg-transparent text-foreground hover:bg-secondary/20 hover:text-foreground",
  ),
  danger: cn(
    TRANSITION,
    "bg-transparent text-danger hover:bg-danger/20 hover:text-danger",
  ),
  warning: cn(
    TRANSITION,
    "bg-transparent text-warning hover:bg-warning/20 hover:text-warning",
  ),
  success: cn(
    TRANSITION,
    "bg-transparent text-success hover:bg-success/20 hover:text-success",
  ),
};

/**
 * CSS classes for the "bordered" variant.
 * Bordered buttons have transparent backgrounds with colored borders and text.
 * They combine the ghost variant styles with a visible border.
 */
const BORDERED_CLASS: Record<Color, string> = {
  none: cn(
    TRANSITION,
    GHOST_CLASS.primary,
    "border-2 border-background hover:border-background/60",
  ),
  primary: cn(
    TRANSITION,
    GHOST_CLASS.primary,
    "border-2 border-primary hover:border-primary/60",
  ),
  secondary: cn(
    TRANSITION,
    GHOST_CLASS.secondary,
    "border-2 border-border hover:border-border/60",
  ),
  danger: cn(
    TRANSITION,
    GHOST_CLASS.danger,
    "border-2 border-danger hover:border-danger/60",
  ),
  warning: cn(
    TRANSITION,
    GHOST_CLASS.warning,
    "border-2 border-warning hover:border-warning/60",
  ),
  success: cn(
    TRANSITION,
    GHOST_CLASS.success,
    "border-2 border-success hover:border-success/60",
  ),
};

/**
 * CSS classes for the "faded" variant.
 * Faded buttons have translucent backgrounds with corresponding text colors,
 * creating a subtle, low-emphasis appearance.
 */
const FADED_CLASS: Record<Color, string> = {
  none: cn(
    TRANSITION,
    "bg-secondary/40 text-foreground border-2 border-transparent hover:bg-secondary/60 hover:border-secondary/40",
  ),
  primary: cn(
    TRANSITION,
    "bg-primary/10 text-primary border-2 border-primary/20 hover:bg-primary/20 hover:border-primary/40",
  ),
  secondary: cn(
    TRANSITION,
    "bg-secondary/15 text-foreground border-2 border-secondary/30 hover:bg-secondary/25 hover:border-secondary/50",
  ),
  danger: cn(
    TRANSITION,
    "bg-danger/10 text-danger border-2 border-danger/20 hover:bg-danger/20 hover:border-danger/40",
  ),
  warning: cn(
    TRANSITION,
    "bg-warning/10 text-warning border-2 border-warning/20 hover:bg-warning/20 hover:border-warning/40",
  ),
  success: cn(
    TRANSITION,
    "bg-success/10 text-success border-2 border-success/20 hover:bg-success/20 hover:border-success/40",
  ),
};

/**
 * Base styles for the underlined variant.
 * Underlined buttons remove all borders and background, keeping only
 * the bottom border and transparent background.
 */
const BASE_UNDERLINED =
  "border-b-2 border-t-0 border-x-0 rounded-none bg-transparent shadow-none";

/**
 * CSS classes for the "underlined" variant.
 * Underlined buttons appear as text with a colored bottom border,
 * similar to a link or tab indicator.
 */
const UNDERLINED_CLASS: Record<Color, string> = {
  none: cn(
    TRANSITION,
    BASE_UNDERLINED,
    "border-background text-foreground hover:border-background/80",
  ),
  primary: cn(
    TRANSITION,
    BASE_UNDERLINED,
    "border-primary text-primary hover:border-primary/80",
  ),
  secondary: cn(
    TRANSITION,
    BASE_UNDERLINED,
    "border-secondary text-secondary hover:border-secondary/80",
  ),
  danger: cn(
    TRANSITION,
    BASE_UNDERLINED,
    "border-danger text-danger hover:border-danger/80",
  ),
  warning: cn(
    TRANSITION,
    BASE_UNDERLINED,
    "border-warning text-warning hover:border-warning/80",
  ),
  success: cn(
    TRANSITION,
    BASE_UNDERLINED,
    "border-success text-success hover:border-success/80",
  ),
};

/**
 * Complete mapping of all variant and color combinations to their CSS classes.
 * This is the internal lookup table used by resolveVariantClass.
 */
const VARIANT_CLASS: Record<Variant, Record<Color, string>> = {
  solid: SOLID_CLASS,
  ghost: GHOST_CLASS,
  bordered: BORDERED_CLASS,
  faded: FADED_CLASS,
  underlined: UNDERLINED_CLASS,
};

/**
 * Resolves the CSS class for a given variant and color combination.
 * Returns the appropriate Tailwind classes for the component's visual style.
 * If the combination is not found, falls back to bordered variant with secondary color.
 *
 * @param variant - The visual style variant to apply.
 * @param color - The color theme to apply.
 * @returns The CSS class string for the specified variant and color.
 *
 * @example
 * ```tsx
 * const className = resolveVariantClass('solid', 'primary');
 * // Returns classes for a solid primary button
 * ```
 */
export function resolveVariantClass(variant: Variant, color: Color): string {
  return VARIANT_CLASS[variant]?.[color] ?? VARIANT_CLASS.bordered.secondary;
}
