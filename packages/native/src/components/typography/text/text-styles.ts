/**
 * Text component styles for the native package.
 *
 * Every entry is a complete, static NativeWind class string. The roles resolve to
 * a size, a weight and a leading together, exactly as they do on the web, so a
 * heading is a heading on either platform rather than a large body.
 */

import type { NativeTextRole, NativeTextTone } from "./text-config";

/**
 * The treatment of each typography role.
 * A role states its size, its weight and its leading together, which is what
 * keeps a heading consistent across a screen.
 */
export const TEXT_ROLE_CLASS: Record<NativeTextRole, string> = {
  display: "text-4xl font-bold leading-tight",
  "heading-xl": "text-3xl font-semibold leading-tight",
  "heading-lg": "text-2xl font-semibold leading-snug",
  "heading-md": "text-xl font-semibold leading-snug",
  "heading-sm": "text-lg font-medium leading-snug",
  "body-lg": "text-lg leading-relaxed",
  "body-md": "text-base leading-normal",
  "body-sm": "text-sm leading-normal",
  label: "text-sm font-medium",
  caption: "text-xs leading-normal",
  overline: "text-xs font-medium uppercase tracking-wide",
};

/** The colour of each tone. */
export const TEXT_TONE_CLASS: Record<NativeTextTone, string> = {
  default: "text-foreground",
  muted: "text-foreground/60",
  none: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

/** Horizontal alignment classes. */
export const TEXT_ALIGN_CLASS: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};
