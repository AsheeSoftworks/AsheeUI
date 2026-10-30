/**
 * The platform's class dictionaries for link.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/navigation/link/link-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { Color, LinkUnderline, LinkVariant, Size } from "@asheeui/core";

/** Shared classes for every native link. */
export const NATIVE_LINK_BASE_CLASS = "flex-row items-center shrink-0";

/**
 * The colour of the text on the platform, which has no pointer to hover with.
 *
 * Typed as the web map is — `Color` rather than `Color` — so the two maps must name
 * the same roles: the vocabulary is shared, and stating it the same way on both sides
 * makes a divergence a compile error instead of a silently unresolved class.
 */
export const NATIVE_LINK_COLOR_CLASS: Record<Color, string> = {
  none: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

/** The emphasis of each variant on the platform. */
export const NATIVE_LINK_VARIANT_CLASS: Record<LinkVariant, string> = {
  default: "",
  muted: "text-foreground/70",
  subtle: "opacity-80",
};

/**
 * When the underline appears on the platform.
 *
 * `hover` becomes `active`: a link that reveals its underline while a pointer rests on
 * it, on a platform with no pointer, reveals it while it is being pressed. That is the
 * platform's own idiom for the same intent rather than an option quietly ignored.
 */
export const NATIVE_LINK_UNDERLINE_CLASS: Record<LinkUnderline, string> = {
  always: "underline",
  hover: "active:underline",
  never: "no-underline",
};

/** The disabled treatment, which dims the link and stops it responding. */
export const NATIVE_LINK_DISABLED_CLASS = "opacity-50";

/** The slot an icon sits in, before or after the text. */
export const NATIVE_LINK_ICON_CLASS = "items-center justify-center shrink-0";

/**
 * The size of the platform's icons at each density.
 *
 * The web sizes a drawn icon with a box; the platform's own affordances are characters,
 * so this is a type size rather than a width and a height.
 */
export const NATIVE_LINK_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * The character a native link shows when it points somewhere else.
 *
 * The web draws an arrow in an icon set this package does not ship; the platform states
 * the same thing with a character, as its other affordances do.
 */
export const NATIVE_LINK_EXTERNAL_GLYPH = "↗";
