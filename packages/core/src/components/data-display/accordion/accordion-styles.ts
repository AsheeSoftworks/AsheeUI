/**
 * The Accordion's class dictionaries, for both renderers.
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

/**
 * The container's treatment, per variant, on the platform.
 *
 * Where the web asks a `divide-y` rule for its dividers, the platform states a gap or a
 * border and lets an item draw the divider it wears.
 */
export const NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS: Record<
  AccordionVariant,
  string
> = {
  bordered: "border border-border",
  separated: "gap-3",
  ghost: "border-y border-border",
  flush: "gap-1",
};

/** An item's treatment, per variant, on the platform. */
export const NATIVE_ACCORDION_VARIANT_ITEM_CLASS: Record<
  AccordionVariant,
  string
> = {
  bordered: "bg-secondary",
  separated: "border border-border bg-secondary",
  ghost: "bg-transparent",
  flush: "bg-transparent",
};

/**
 * The divider an item wears when another item is above it.
 *
 * The web states this in the container with `divide-y`; the platform states it per item,
 * because it has no rule that reaches between its children.
 */
export const NATIVE_ACCORDION_DIVIDER_CLASS = "border-t border-border";

/** The trigger, which fills the item's width and holds the text and the indicator. */
export const NATIVE_ACCORDION_HEADER_CLASS =
  "w-full flex-row items-center justify-between gap-3";

/** The block that holds the item's icon and its two lines of text. */
export const NATIVE_ACCORDION_HEADER_TEXT_CLASS =
  "flex-row items-center gap-3 flex-1 min-w-0";

/** The slot an item's icon sits in. */
export const NATIVE_ACCORDION_ICON_CLASS = "shrink-0";

/** The item's title. */
export const NATIVE_ACCORDION_TITLE_CLASS = "font-semibold text-foreground";

/** The item's supporting line. */
export const NATIVE_ACCORDION_SUBTITLE_CLASS = "text-xs text-foreground/70";

/** The block that keeps the title above its supporting line. */
export const NATIVE_ACCORDION_HEADING_CLASS = "flex-col min-w-0";

/** The expand indicator, which turns over when the item is open. */
export const NATIVE_ACCORDION_INDICATOR_CLASS = "text-foreground/70 shrink-0";

/** The turn the indicator makes when the item is open. */
export const NATIVE_ACCORDION_INDICATOR_OPEN_CLASS = "rotate-180";

/**
 * The character the native accordion shows as its expand indicator.
 *
 * The web draws a chevron in an icon set this package does not ship; the platform states
 * the same thing with a character, as its other affordances do.
 */
export const NATIVE_ACCORDION_INDICATOR_GLYPH = "▾";

/** The revealed content. */
export const NATIVE_ACCORDION_CONTENT_CLASS = "text-foreground/70";
