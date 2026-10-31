/**
 * The web renderer's class dictionaries for badge.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/data-display/badge/badge-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Size } from "@asheeui/core";

/**
 * The layout every web badge starts from, before any resolved treatment is added.
 */
export const BADGE_BASE_CLASS =
  "inline-flex items-center justify-center shrink-0 whitespace-nowrap font-medium select-none";

/**
 * CSS classes for badge height based on size.
 * Controls the vertical dimension of the badge.
 */
export const BADGE_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-5",
  md: "h-6",
  lg: "h-7",
};

/**
 * CSS classes for badge horizontal padding based on size.
 * Controls the left and right padding of the badge.
 */
export const BADGE_PADDING_CLASS: Record<Size, string> = {
  sm: "px-1.5",
  md: "px-2",
  lg: "px-2.5",
};

/**
 * CSS classes for badge font size based on size.
 * Controls the text size of the badge content. The web can start below the scale's
 * first step because a pointer can zoom a page; a native label has no such
 * affordance, which is why `NATIVE_BADGE_FONT_CLASS` starts one step higher.
 */
export const BADGE_FONT_CLASS: Record<Size, string> = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

/**
 * CSS classes for badge gap based on size.
 * Controls the spacing between an icon and the badge content.
 */
export const BADGE_GAP_CLASS: Record<Size, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-1.5",
};

/**
 * The layout of the box an icon sits in.
 *
 * The badge gives its icon the same kind of slot the chip does rather than styling the
 * drawing from the root, so which node a consumer passes cannot change how it is laid
 * out.
 */
export const BADGE_SLOT_CLASS =
  "inline-flex items-center justify-center shrink-0";

/**
 * CSS classes for icon size based on size.
 * Applied to the icon slot so an icon matches the badge's scale. The slot is stated and
 * so is the SVG inside it: a consumer's icon is usually an SVG that carries a size of
 * its own, and a box around it only clips what it draws. Stating both is what makes the
 * same node render the same size in a badge and in a chip, whose icon slot states the
 * pair too — the web alone has this affordance, because a native icon is a component
 * with a size prop of its own.
 */
export const BADGE_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "size-3 [&_svg]:size-3",
  md: "size-3.5 [&_svg]:size-3.5",
  lg: "size-4 [&_svg]:size-4",
};
