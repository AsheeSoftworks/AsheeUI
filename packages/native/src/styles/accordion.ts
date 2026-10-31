/**
 * The platform's class dictionaries for accordion.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/data-display/accordion/accordion-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { AccordionVariant } from "@asheeui/core";

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
