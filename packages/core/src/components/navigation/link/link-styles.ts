/**
 * The Link's class dictionaries, for the web renderer.
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
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";
import type { Color } from "../../../shared/variant";
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

/**
 * The colour of the text, with its hover state, on the web.
 *
 * The map is exhaustive over the colour roles, so a role added to the vocabulary and
 * forgotten here is a type error rather than an unresolved class. It carries exactly the
 * roles {@link NATIVE_LINK_COLOR_CLASS} carries, which is what keeps the two renderers
 * from drifting apart.
 */
export const LINK_COLOR_CLASS: Record<Color, string> = {
  none: "text-foreground hover:text-foreground/80",
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
