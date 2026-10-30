/**
 * The web renderer's class dictionaries for chip.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/data-display/chip/chip-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Size } from "@asheeui/core";

/**
 * CSS classes for chip height based on size.
 * Controls the vertical dimension of the chip.
 */
export const CHIP_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-6",
  md: "h-7",
  lg: "h-8",
};

/**
 * CSS classes for chip horizontal padding based on size.
 * Controls the left and right padding of the chip.
 */
export const CHIP_PADDING_CLASS: Record<Size, string> = {
  sm: "px-2",
  md: "px-2.5",
  lg: "px-3",
};

/**
 * CSS classes for chip font size based on size.
 * Controls the text size of the chip label.
 */
export const CHIP_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * CSS classes for chip gap based on size.
 * Controls the spacing between chip elements (icon, avatar, dot, label).
 */
export const CHIP_GAP_CLASS: Record<Size, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

/**
 * CSS classes for chip icon size based on size.
 * Controls the dimensions of the slot an icon or the remove control sits in, and of
 * the drawing inside it.
 *
 * The slot is stated and so is the SVG, because the two are not the same rule: a
 * consumer's icon is usually an SVG that carries a size of its own, and a box around
 * it only clips what it draws. Stating both is what makes a bare inline SVG the size
 * the density asks for, and it is what the badge states too — the same node has to
 * render the same size in both siblings.
 */
export const CHIP_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "size-3 [&_svg]:size-3",
  md: "size-3.5 [&_svg]:size-3.5",
  lg: "size-4 [&_svg]:size-4",
};

/**
 * The layout every web chip starts from, before any resolved treatment is added.
 */
export const CHIP_BASE_CLASS =
  "inline-flex items-center font-medium transition-all duration-200 select-none shrink-0";

/**
 * The web chip's focus ring, which a platform control draws itself.
 */
export const CHIP_FOCUS_CLASS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/**
 * The web chip's disabled treatment, which the platform states as a state rather than as a
 * set of classes.
 */
export const CHIP_DISABLED_CLASS =
  "opacity-50 pointer-events-none cursor-not-allowed";

/** The web chip's status dot. */
export const CHIP_DOT_CLASS = "shrink-0 rounded-full";

/** The box around an icon, an avatar or the remove control. */
export const CHIP_SLOT_CLASS =
  "inline-flex items-center justify-center shrink-0";

/**
 * The box around an avatar, which clips it to a circle.
 *
 * The diameter comes from {@link CHIP_AVATAR_SIZE_CLASS}; what is stated here is what
 * has to hold whatever the consumer puts inside. A node that states a diameter of its
 * own — the framework's `Avatar` does — is held to the slot rather than cropped by it,
 * so a face is scaled into the circle instead of being cut to a smaller one.
 */
export const CHIP_AVATAR_CLASS =
  "inline-flex items-center justify-center shrink-0 scrollbar-hide overflow-hidden rounded-full [&>*]:max-h-full [&>*]:max-w-full";

/** The web chip's remove control. */
export const CHIP_CLOSE_CLASS =
  "inline-flex items-center justify-center shrink-0 rounded-full transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current opacity-80 -mr-1";
