/**
 * Card component styles for the native package.
 *
 * Every entry is a complete, static NativeWind class string. The surface and the
 * accent are separate maps, so a card can keep a neutral surface and take the
 * theme's accent on its border, which is what a card usually wants.
 */

import type { ColorRole, Radius, Size, Variant } from "@asheeui/shared";

/** Shared classes for every card. */
export const CARD_BASE_CLASS = "flex-col gap-2";

/** The surface treatment of each variant. */
export const CARD_VARIANT_CLASS: Record<Variant, string> = {
  solid: "bg-secondary",
  faded: "bg-secondary/40",
  bordered: "border border-border bg-background",
  ghost: "bg-transparent",
  underlined: "border-b border-border bg-background",
};

/** The accent colour of the surface's border, per colour role. */
export const CARD_COLOR_CLASS: Record<ColorRole, string> = {
  none: "border-foreground/20",
  primary: "border-primary/40",
  secondary: "border-secondary",
  danger: "border-danger/40",
  warning: "border-warning/40",
  success: "border-success/40",
};

/** Padding for each density. */
export const CARD_SIZE_CLASS: Record<Size, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

/** Corner rounding for each radius token. */
export const CARD_RADIUS_CLASS: Record<Radius, string> = {
  none: "rounded-none",
  xs: "rounded-sm",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

/** The heading block, which keeps the title above its description. */
export const CARD_HEADING_CLASS = "flex-col gap-1";

/** The footer row, which holds the card's actions. */
export const CARD_FOOTER_CLASS = "flex-row flex-wrap items-center gap-2 pt-2";
