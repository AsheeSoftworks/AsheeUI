import type { AccordionSizeKey, AccordionVariant } from "./accordion-config";

export const ACCORDION_HEADER_SIZE_CLASS: Record<AccordionSizeKey, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-3.5 text-sm",
  lg: "px-6 py-4 text-base",
};

export const ACCORDION_CONTENT_SIZE_CLASS: Record<AccordionSizeKey, string> = {
  sm: "px-3.5 pb-2 text-xs",
  md: "px-5 pb-3.5 text-sm",
  lg: "px-6 pb-4 text-base",
};

export const ACCORDION_RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const ACCORDION_VARIANT_CONTAINER_CLASS: Record<
  AccordionVariant,
  string
> = {
  bordered: "border border-border divide-y divide-border overflow-hidden",
  separated: "space-y-3",
  flush: "divide-y divide-border border-y border-border",
  ghost: "space-y-1",
};

export const ACCORDION_VARIANT_ITEM_CLASS: Record<AccordionVariant, string> = {
  bordered: "bg-card transition-colors hover:bg-muted/30",
  separated:
    "border border-border bg-card transition-colors hover:bg-muted/30 shadow-xs",
  flush: "bg-transparent transition-colors hover:bg-muted/20",
  ghost: "bg-transparent hover:bg-muted/50 transition-colors",
};
