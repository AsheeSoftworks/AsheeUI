/**
 * The Accordion's class dictionaries, for the web renderer.
 *
 * The scale is shared: a header's padding and type size are the framework's spacing and
 * typography, so both renderers compile the same utilities. The container and item maps
 * are not, because the two renderers group a stack differently: the web draws its
 * dividers with a `divide-y` rule and its spacing with a `space-y` rule, and the platform
 * has neither utility, so it states a divider class an item wears when it is not the
 * first and reaches for the same gaps.
 *
 * Every entry is a complete, static class string. An unprefixed `ACCORDION_*` constant is
 * the web renderer's; `NATIVE_ACCORDION_*` is the native renderer's.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { AccordionSizeKey, AccordionVariant } from "./accordion-config";

/** Header padding and type size at each density. */
export const ACCORDION_HEADER_SIZE_CLASS: Record<AccordionSizeKey, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-3.5 text-sm",
  lg: "px-6 py-4 text-base",
};

/** Content padding and type size at each density. */
export const ACCORDION_CONTENT_SIZE_CLASS: Record<AccordionSizeKey, string> = {
  sm: "px-3.5 pb-2 text-xs",
  md: "px-5 pb-3.5 text-sm",
  lg: "px-6 pb-4 text-base",
};

/** The container's treatment, per variant, on the web. */
export const ACCORDION_VARIANT_CONTAINER_CLASS: Record<
  AccordionVariant,
  string
> = {
  bordered: "border border-border divide-y divide-border",
  separated: "space-y-3",
  ghost: "divide-y divide-border border-y border-border",
  flush: "space-y-1",
};

/** An item's treatment, per variant, on the web. */
export const ACCORDION_VARIANT_ITEM_CLASS: Record<AccordionVariant, string> = {
  bordered: "bg-secondary transition-colors hover:bg-foreground/10",
  separated:
    "border border-border bg-secondary transition-colors hover:bg-secondary/30 shadow-xs",
  ghost: "bg-transparent transition-colors hover:bg-secondary/20",
  flush: "bg-transparent hover:bg-secondary/50 transition-colors",
};

// ─── Native ───────────────────────────────────────────────────────────────────
