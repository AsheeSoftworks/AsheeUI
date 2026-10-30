/**
 * The platform's class dictionaries for chip.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/data-display/chip/chip-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { ChipVariant, ColorRole, Size } from "@asheeui/core";

/**
 * The layout every native chip starts from, before any resolved treatment is added.
 * The chip hugs its content, as the web chip does, rather than filling the column.
 */
export const NATIVE_CHIP_BASE_CLASS =
  "flex-row items-center justify-center self-start";

/**
 * The padding for each density.
 *
 * Padding is per density here rather than fixed, because the chip has no explicit height to
 * size around: the padding and the text step are what give it one.
 */
export const NATIVE_CHIP_PADDING_CLASS: Record<Size, string> = {
  sm: "px-2 py-0.5",
  md: "px-2.5 py-1",
  lg: "px-3 py-1.5",
};

/**
 * The label's text size for each density.
 *
 * These are the web's own steps: unlike the badge, whose smallest step is a sub-scale value
 * the web can zoom, the chip already starts at the scale's first step, so it needs no lift
 * to survive being read at arm's length.
 */
export const NATIVE_CHIP_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/** The gap between the chip's parts, for each density. */
export const NATIVE_CHIP_GAP_CLASS: Record<Size, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

/**
 * The size of the box an icon or the remove control sits in, per density, on the native
 * renderer. The web's three icon sizes are 12, 14 and 16 points; these state the same three.
 *
 * An avatar gets a larger box of its own on both renderers — {@link CHIP_AVATAR_SIZE_CLASS}
 * here and `NATIVE_CHIP_AVATAR_SIZE_CLASS` in the native package (16, 20 and 24) — because a
 * face drawn at 12 is a smudge. This map therefore sizes icons, not avatars.
 */
export const NATIVE_CHIP_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

/**
 * The surface and border of each treatment and colour.
 *
 * The treatment and the colour resolve together, because a chip's emphasis comes from the
 * pair: a filled chip carries its colour in the background while an outlined one carries it
 * in its border as well. It mirrors what the shared variant map draws on the web, in the
 * platform's vocabulary.
 */
export const NATIVE_CHIP_VARIANT_CLASS: Record<
  ChipVariant,
  Record<ColorRole, string>
> = {
  solid: {
    none: "bg-foreground border border-transparent",
    primary: "bg-primary border border-transparent",
    secondary: "bg-secondary border border-transparent",
    danger: "bg-danger border border-transparent",
    warning: "bg-warning border border-transparent",
    success: "bg-success border border-transparent",
  },
  faded: {
    none: "bg-secondary/40 border border-transparent",
    primary: "bg-primary/10 border border-primary/20",
    secondary: "bg-secondary/15 border border-secondary/30",
    danger: "bg-danger/10 border border-danger/20",
    warning: "bg-warning/10 border border-warning/20",
    success: "bg-success/10 border border-success/20",
  },
  bordered: {
    none: "bg-transparent border border-background",
    primary: "bg-transparent border border-primary",
    secondary: "bg-transparent border border-border",
    danger: "bg-transparent border border-danger",
    warning: "bg-transparent border border-warning",
    success: "bg-transparent border border-success",
  },
  ghost: {
    none: "bg-transparent border border-transparent",
    primary: "bg-transparent border border-transparent",
    secondary: "bg-transparent border border-transparent",
    danger: "bg-transparent border border-transparent",
    warning: "bg-transparent border border-transparent",
    success: "bg-transparent border border-transparent",
  },
};

/**
 * The colour of the label of each treatment and colour.
 * A filled treatment leaves the label in the framework's foreground; the rest carry the
 * accent, which is what the web's shared variant map does with its own `text-*` classes.
 */
export const NATIVE_CHIP_TEXT_CLASS: Record<
  ChipVariant,
  Record<ColorRole, string>
> = {
  solid: {
    none: "text-background",
    primary: "text-foreground",
    secondary: "text-foreground",
    danger: "text-foreground",
    warning: "text-foreground",
    success: "text-foreground",
  },
  faded: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
  bordered: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
  ghost: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
};

/**
 * The status dot, per colour role.
 * A consumer that passes its own colour string gets that value instead, which is the same
 * choice the web dot offers.
 */
export const NATIVE_CHIP_DOT_CLASS: Record<ColorRole, string> = {
  none: "bg-foreground",
  primary: "bg-primary",
  secondary: "bg-secondary",
  danger: "bg-danger",
  warning: "bg-warning",
  success: "bg-success",
};

/** The dot's shape, which is round at every density. */
export const NATIVE_CHIP_DOT_SHAPE_CLASS = "rounded-full h-1.5 w-1.5";

/** The box around an icon, an avatar or the remove control. */
export const NATIVE_CHIP_SLOT_CLASS = "items-center justify-center";

/** The box around an avatar, which clips it to a circle. */
export const NATIVE_CHIP_AVATAR_CLASS =
  "items-center justify-center overflow-hidden rounded-full";

/**
 * The native chip's remove control.
 * It is a pressable of its own, so it announces itself as a control with its own name.
 */
export const NATIVE_CHIP_CLOSE_CLASS =
  "items-center justify-center rounded-full opacity-80";

/** The character the remove control draws when the consumer supplies no icon. */
export const NATIVE_CHIP_CLOSE_GLYPH = "×";

/** The chip's disabled treatment, which dims it without removing the space it holds. */
export const NATIVE_CHIP_DISABLED_CLASS = "opacity-50";
