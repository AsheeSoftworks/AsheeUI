/**
 * The Link's class dictionaries, for both renderers.
 *
 * A link's scale is the framework's typography and spacing, so both renderers compile
 * the same size and spacing utilities; what each renderer has to say for itself is what
 * it does with an interaction. The web reveals an underline while a pointer rests on the
 * link, and the platform reveals it while the link is pressed, because there is no
 * pointer to rest anywhere — which is why the underline map is a map per renderer rather
 * than one map both read.
 *
 * Every entry is a complete, static class string: Tailwind on the web and NativeWind on
 * native both compile the classes they can read in the source. An unprefixed `LINK_*`
 * constant is the web renderer's; `NATIVE_LINK_*` is the native renderer's.
 */

import type { Size } from "../../shared/radius";
import type { Color } from "../../shared/variant";
import type { ColorRole } from "../../tokens";
import type { LinkUnderline, LinkVariant } from "./link-config";

/** Font size and the gap beside the icons, at each density. */
export const LINK_SIZE_CLASS: Record<Size, string> = {
  sm: "text-xs gap-1.5",
  md: "text-sm gap-2",
  lg: "text-base gap-2.5",
};

/** The width and height of a drawn icon at each density, on the web. */
export const LINK_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
};

/** The colour of the text, with its hover state, on the web. */
export const LINK_COLOR_CLASS: Record<Color | string, string> = {
  none: "text-foreground hover:text-foreground/80",
  default: "text-foreground hover:text-foreground/80",
  primary: "text-primary hover:text-primary/80",
  secondary: "text-secondary hover:text-secondary/80",
  success: "text-success hover:text-success/80",
  warning: "text-warning hover:text-warning/80",
  danger: "text-danger hover:text-danger/80",
};

/** The emphasis of each variant, on the web. */
export const LINK_VARIANT_CLASS: Record<LinkVariant, string> = {
  default: "",
  muted: "text-foreground/70 hover:text-foreground",
  subtle: "opacity-80 hover:opacity-100",
};

/** When the underline appears, on the web. */
export const LINK_UNDERLINE_CLASS: Record<LinkUnderline, string> = {
  always: "underline underline-offset-4 decoration-current",
  hover: "no-underline hover:underline underline-offset-4 decoration-current",
  never: "no-underline",
};

// ─── Native ───────────────────────────────────────────────────────────────────

/** Shared classes for every native link. */
export const NATIVE_LINK_BASE_CLASS = "flex-row items-center shrink-0";

/** The colour of the text on the platform, which has no pointer to hover with. */
export const NATIVE_LINK_COLOR_CLASS: Record<ColorRole, string> = {
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
