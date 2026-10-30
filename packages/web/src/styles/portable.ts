/**
 * The strings both renderers compile, duplicated on purpose.
 *
 * These are the framework's platform-portable vocabulary: a gap, a field's label size, a tooltip's
 * padding — strings whose utilities mean the same thing to Tailwind and to NativeWind. They were
 * `@asheeui/core`'s until C2; they are copied here instead, because the alternative is a permanent
 * exception to the rule that core holds no class string at all.
 *
 * A copy can drift, so `packages/core/src/shared/style-parity.test.ts` reads this file and the
 * other renderer's beside it and fails when a pair stops matching. Change one, change both.
 */

import type {
  AccordionSizeKey,
  FieldStatus,
  Size,
  Space,
  TooltipSizeKey,
} from "@asheeui/core";

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

/** The inner padding of a slide at each density. */
export const CAROUSEL_PADDING_CLASS: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * CSS classes for the avatar slot's diameter based on size.
 *
 * An avatar is a picture of something rather than a glyph beside it, so it takes more
 * of the chip than an icon does: 16, 20 and 24 points inside chips that are 24, 28
 * and 32, which leaves the same four points of breathing room at every density. It is
 * a map of its own for that reason — reusing the icon's would draw a face at 12.
 */
export const CHIP_AVATAR_SIZE_CLASS: Record<Size, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

/**
 * The sentence a data table states its row count with, by default.
 *
 * The placeholders are the ones {@link formatRowCountLabel} fills: `{first}` and `{last}`
 * are the first and last row currently shown, and `{total}` is how many rows there are.
 */
export const DATA_TABLE_ROW_COUNT_LABEL =
  "Showing {first} to {last} of {total}";

/** Width of a message at each density, which is the width a sentence fits in. */
export const TOAST_WIDTH_CLASS: Record<Size, string> = {
  sm: "w-72 max-w-full",
  md: "w-80 max-w-full",
  lg: "w-96 max-w-full",
};

/** Padding of a message at each density. */
export const TOAST_PADDING_CLASS: Record<Size, string> = {
  sm: "p-2.5",
  md: "p-3.5",
  lg: "p-4",
};

/** Type size of a message at each density. */
export const TOAST_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/** Type size and weight of a message's title at each density. */
export const TOAST_TITLE_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs font-semibold",
  md: "text-sm font-semibold",
  lg: "text-base font-semibold",
};

/**
 * The marker that shows a field has to be filled in.
 * Both platforms draw the same asterisk in the same role colour.
 */
export const FIELD_REQUIRED_MARKER_CLASS = "text-danger";

/**
 * The tone of the message for each validation status.
 *
 * Both platforms draw it the same way, so one map serves both: a failed field's
 * message is the danger colour because the message is where the user is told what to
 * fix. The shell's own label and description keep the neutral foreground, since a
 * field that failed still has to be readable to be corrected.
 */
export const FIELD_STATUS_TEXT_CLASS: Record<FieldStatus, string> = {
  default: "text-foreground",
  error: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

/** Font size and the gap beside the icons, at each density. */
export const LINK_SIZE_CLASS: Record<Size, string> = {
  sm: "text-xs gap-1.5",
  md: "text-sm gap-2",
  lg: "text-base gap-2.5",
};

/** The typographic treatment of a brand that is a link, on the web. */
export const NAVBAR_BRAND_TEXT_CLASS = "font-semibold text-foreground";

/** The horizontal padding of a trigger at each density. */
export const TABS_PADDING_X_CLASS: Record<Size, string> = {
  sm: "px-2.5",
  md: "px-3.5",
  lg: "px-4",
};

/** The type size of a trigger at each density. */
export const TABS_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/** The hint's horizontal padding, at each size. */
export const TOOLTIP_PADDING_X_CLASS: Record<TooltipSizeKey, string> = {
  sm: "px-2",
  md: "px-3",
  lg: "px-4",
};

/** The hint's vertical padding, at each size. */
export const TOOLTIP_PADDING_Y_CLASS: Record<TooltipSizeKey, string> = {
  sm: "py-1",
  md: "py-1.5",
  lg: "py-2",
};

/** The hint's type size, at each size. */
export const TOOLTIP_FONT_CLASS: Record<TooltipSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * Flex and grid gap classes for each spacing token.
 * Used by `Stack` and `Grid` for the space between their children.
 */
export const SPACE_GAP_CLASS: Record<Space, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
};

/**
 * Vertical padding classes for a page section.
 * Larger tokens add a wider step at the `md` breakpoint, so the same token
 * reads as a section on a phone and as a band on a wide screen.
 */
export const SPACE_PADDING_Y_CLASS: Record<Space, string> = {
  none: "py-0",
  xs: "py-2",
  sm: "py-6",
  md: "py-8 md:py-12",
  lg: "py-12 md:py-16",
  xl: "py-16 md:py-24",
  "2xl": "py-20 md:py-32",
};

/**
 * Minimum height classes for a region that claims space before it places its
 * content.
 * The scale is deliberately coarse: it exists so a layout can claim a region of
 * the page (a centred block, a loading region), not so it can express every
 * height Tailwind supports.
 */
export const SPACE_MIN_HEIGHT_CLASS: Record<Space, string> = {
  none: "",
  xs: "min-h-16",
  sm: "min-h-24",
  md: "min-h-48",
  lg: "min-h-72",
  xl: "min-h-96",
  "2xl": "min-h-screen",
};

/**
 * Vertical rhythm classes for stacked block content.
 * Applied to a container whose direct children are blocks rather than
 * flex or grid items.
 */
export const SPACE_BLOCK_CLASS: Record<Space, string> = {
  none: "space-y-0",
  xs: "space-y-1",
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-6",
  xl: "space-y-8",
  "2xl": "space-y-12",
};
