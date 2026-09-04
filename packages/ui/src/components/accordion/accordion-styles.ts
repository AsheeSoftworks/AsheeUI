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

export const ACCORDION_VARIANT_CONTAINER_CLASS: Record<
  AccordionVariant,
  string
> = {
  bordered: "border border-border divide-y divide-border overflow-hidden",
  separated: "space-y-3",
  ghost: "divide-y divide-border border-y border-border",
  flush: "space-y-1",
};

export const ACCORDION_VARIANT_ITEM_CLASS: Record<AccordionVariant, string> = {
  bordered: "bg-secondary transition-colors hover:bg-secondary/30",
  separated:
    "border border-border bg-secondary transition-colors hover:bg-secondary/30 shadow-xs",
  ghost: "bg-transparent transition-colors hover:bg-secondary/20",
  flush: "bg-transparent hover:bg-secondary/50 transition-colors",
};
