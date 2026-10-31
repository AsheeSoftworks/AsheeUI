/**
 * The web renderer's class dictionaries for link.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/navigation/link/link-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Color, LinkUnderline, LinkVariant, Size } from "@asheeui/core";

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
