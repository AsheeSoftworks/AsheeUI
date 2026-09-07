/**
 * Accordion component styles for AsheeUI.
 * This file provides CSS class mappings for the Accordion component's
 * variants and size options. These classes define the visual appearance
 * of headers, content panels, containers, and individual items.
 */

import type { AccordionSizeKey, AccordionVariant } from "./accordion-config";

/**
 * CSS classes for accordion header padding and font size.
 * Maps size keys to Tailwind classes that control the header's
 * spacing and typography.
 */
export const ACCORDION_HEADER_SIZE_CLASS: Record<AccordionSizeKey, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-3.5 text-sm",
  lg: "px-6 py-4 text-base",
};

/**
 * CSS classes for accordion content padding and font size.
 * Maps size keys to Tailwind classes that control the content panel's
 * spacing and typography.
 */
export const ACCORDION_CONTENT_SIZE_CLASS: Record<AccordionSizeKey, string> = {
  sm: "px-3.5 pb-2 text-xs",
  md: "px-5 pb-3.5 text-sm",
  lg: "px-6 pb-4 text-base",
};

/**
 * CSS classes for accordion container based on variant.
 * These classes control the overall container appearance, including
 * borders, dividers, and spacing between items.
 */
export const ACCORDION_VARIANT_CONTAINER_CLASS: Record<
  AccordionVariant,
  string
> = {
  bordered: "border border-border divide-y divide-border",
  separated: "space-y-3",
  ghost: "divide-y divide-border border-y border-border",
  flush: "space-y-1",
};

/**
 * CSS classes for individual accordion items based on variant.
 * These classes control the appearance of each item, including
 * backgrounds, borders, and hover states.
 */
export const ACCORDION_VARIANT_ITEM_CLASS: Record<AccordionVariant, string> = {
  bordered: "bg-secondary transition-colors hover:bg-foreground/10",
  separated:
    "border border-border bg-secondary transition-colors hover:bg-secondary/30 shadow-xs",
  ghost: "bg-transparent transition-colors hover:bg-secondary/20",
  flush: "bg-transparent hover:bg-secondary/50 transition-colors",
};
