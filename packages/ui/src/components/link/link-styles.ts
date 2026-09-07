/**
 * Link component styles for AsheeUI.
 * This file provides CSS class mappings for the Link component's
 * size, color, variant, and underline options.
 */

import type { Color, Size } from "../../shared";
import type { LinkUnderline, LinkVariant } from "./link-config";

/**
 * CSS classes for link font size.
 * Maps size keys to Tailwind classes for text size and gap spacing.
 */
export const LINK_SIZE_CLASS: Record<Size, string> = {
  sm: "text-xs gap-1.5",
  md: "text-sm gap-2",
  lg: "text-base gap-2.5",
};

/**
 * CSS classes for link icon size.
 * Maps size keys to Tailwind classes for icon dimensions.
 */
export const LINK_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
};

/**
 * CSS classes for link colors.
 * Maps color keys to Tailwind text color and hover state classes.
 */
export const LINK_COLOR_CLASS: Record<Color | string, string> = {
  none: "text-foreground hover:text-foreground/80",
  default: "text-foreground hover:text-foreground/80",
  primary: "text-primary hover:text-primary/80",
  secondary: "text-secondary hover:text-secondary/80",
  success: "text-success hover:text-success/80",
  warning: "text-warning hover:text-warning/80",
  danger: "text-danger hover:text-danger/80",
};

/**
 * CSS classes for link variants.
 * Controls the emphasis and opacity of the link.
 */
export const LINK_VARIANT_CLASS: Record<LinkVariant, string> = {
  default: "",
  muted: "text-foreground/70 hover:text-foreground",
  subtle: "opacity-80 hover:opacity-100",
};

/**
 * CSS classes for link underline behavior.
 * Controls when and how the underline is displayed.
 */
export const LINK_UNDERLINE_CLASS: Record<LinkUnderline, string> = {
  always: "underline underline-offset-4 decoration-current",
  hover: "no-underline hover:underline underline-offset-4 decoration-current",
  never: "no-underline",
};
