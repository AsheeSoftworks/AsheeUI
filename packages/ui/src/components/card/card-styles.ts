/**
 * Card component styles for AsheeUI.
 * This file provides CSS class mappings for the Card component's
 * variants, padding, and spacing options.
 */

import type { Size } from "../../shared";
import type { CardVariant } from "./card-config";

/**
 * CSS classes for card padding based on size.
 * Controls the internal padding of the card content area.
 */
export const CARD_PADDING_CLASS: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * CSS classes for card gap based on size.
 * Controls the spacing between card sections.
 */
export const CARD_GAP_CLASS: Record<Size, string> = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-5",
};

/**
 * CSS classes for card header gap based on size.
 * Controls the spacing between header elements (title, description, header).
 */
export const CARD_HEADER_GAP_CLASS: Record<Size, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

/**
 * CSS classes for card variants.
 * Each variant has a distinct background, border, and shadow treatment.
 */
export const CARD_VARIANT_CLASS: Record<CardVariant, string> = {
  elevated: "bg-secondary text-foreground shadow-md border border-border/40",
  bordered: "bg-background text-foreground border border-border shadow-xs",
  flat: "bg-secondary/50 text-foreground border-none",
  ghost: "bg-transparent text-foreground border-none shadow-none",
};
