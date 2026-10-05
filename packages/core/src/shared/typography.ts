/**
 * Typography token definitions for AsheeUI.
 *
 * Typography uses the same two-layer model as radius and colour: a semantic
 * layer (roles) resolves to a size/style layer, which resolves to complete,
 * static Tailwind class strings. This file holds the types and the mappings;
 * the public `Typography` component consumes them.
 *
 * @see `docs/docs/asheeui-typography-specification-proposal.md` (approved M2
 * specification) for the rationale, the role table and the compatibility notes.
 */

/** The available typography size tokens. */
export type TypographySize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

/** The available font-weight tokens. */
export type TypographyWeight = "normal" | "medium" | "semibold" | "bold";

/** The available line-height tokens. */
export type TypographyLeading =
  | "tight"
  | "snug"
  | "normal"
  | "relaxed"
  | "loose";

/** The available letter-spacing tokens. */
export type TypographyTracking =
  | "tighter"
  | "tight"
  | "normal"
  | "wide"
  | "wider"
  | "widest";

/**
 * The semantic typography roles.
 * A role describes why text exists and resolves to a complete treatment.
 */
export type TypographyRole =
  | "display"
  | "heading-xl"
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "label"
  | "caption"
  | "overline";

/**
 * The colour treatments available to typography.
 * `default`, `muted` and `disabled` are derived from the foreground token;
 * the remaining values are framework colour tokens resolved through the colour
 * engine, never raw Tailwind palette colours.
 */
export type TypographyTone =
  | "default"
  | "muted"
  | "disabled"
  | "primary"
  | "secondary"
  | "danger"
  | "warning"
  | "success"
  | "none";

/** Text alignment options. */
export type TypographyAlign = "left" | "center" | "right" | "justify";

/** The size/style tokens a role resolves to. */
export interface TypographyRoleTokens {
  /** Size token. */
  size: TypographySize;
  /** Font-weight token. */
  weight: TypographyWeight;
  /** Line-height token. */
  leading: TypographyLeading;
  /** Letter-spacing token. */
  tracking: TypographyTracking;
}

/**
 * Size token to static Tailwind class.
 * Note the deliberate difference between the token name (`md`) and the utility
 * (`text-base`): the token is the semantic name, as with `RADIUS_CLASS`.
 */
export const TYPOGRAPHY_SIZE_CLASS: Record<TypographySize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

/** Font-weight token to static Tailwind class. */
export const TYPOGRAPHY_WEIGHT_CLASS: Record<TypographyWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

/** Line-height token to static Tailwind class. */
export const TYPOGRAPHY_LEADING_CLASS: Record<TypographyLeading, string> = {
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

/** Letter-spacing token to static Tailwind class. */
export const TYPOGRAPHY_TRACKING_CLASS: Record<TypographyTracking, string> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

/** Tone token to static Tailwind class, using framework colour tokens only. */
export const TYPOGRAPHY_TONE_CLASS: Record<TypographyTone, string> = {
  default: "text-foreground",
  muted: "text-foreground/60",
  disabled: "text-foreground/50",
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
  none: "text-background",
};

/** Alignment token to static Tailwind class. */
export const TYPOGRAPHY_ALIGN_CLASS: Record<TypographyAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

/**
 * The size/style tokens each semantic role resolves to.
 * This table is the documentation source for {@link TYPOGRAPHY_ROLE_CLASS};
 * a test asserts the two can never drift.
 */
export const TYPOGRAPHY_ROLE_TOKEN: Record<
  TypographyRole,
  TypographyRoleTokens
> = {
  display: {
    size: "3xl",
    weight: "semibold",
    leading: "tight",
    tracking: "tight",
  },
  "heading-xl": {
    size: "2xl",
    weight: "semibold",
    leading: "tight",
    tracking: "tight",
  },
  "heading-lg": {
    size: "xl",
    weight: "semibold",
    leading: "snug",
    tracking: "normal",
  },
  "heading-md": {
    size: "lg",
    weight: "semibold",
    leading: "snug",
    tracking: "normal",
  },
  "heading-sm": {
    size: "md",
    weight: "semibold",
    leading: "snug",
    tracking: "normal",
  },
  "body-lg": {
    size: "lg",
    weight: "normal",
    leading: "relaxed",
    tracking: "normal",
  },
  "body-md": {
    size: "md",
    weight: "normal",
    leading: "normal",
    tracking: "normal",
  },
  "body-sm": {
    size: "sm",
    weight: "normal",
    leading: "normal",
    tracking: "normal",
  },
  label: {
    size: "sm",
    weight: "medium",
    leading: "normal",
    tracking: "normal",
  },
  caption: {
    size: "xs",
    weight: "normal",
    leading: "normal",
    tracking: "normal",
  },
  overline: {
    size: "xs",
    weight: "semibold",
    leading: "normal",
    tracking: "wider",
  },
};

/**
 * The semantic element each role renders by default.
 * Consumers can override the element without changing the treatment.
 */
export const TYPOGRAPHY_ROLE_DEFAULT_ELEMENT: Record<TypographyRole, string> = {
  display: "h1",
  "heading-xl": "h1",
  "heading-lg": "h2",
  "heading-md": "h3",
  "heading-sm": "h4",
  "body-lg": "p",
  "body-md": "p",
  "body-sm": "p",
  label: "span",
  caption: "span",
  overline: "span",
};

/**
 * The complete, static class string for each semantic role.
 *
 * These are written out in full rather than composed at render time: Tailwind
 * class names must always be static and complete. The entries are asserted
 * against {@link TYPOGRAPHY_ROLE_TOKEN} in the test suite, so the documented
 * token table and the shipped classes cannot drift.
 */
export const TYPOGRAPHY_ROLE_CLASS: Record<TypographyRole, string> = {
  display: "text-3xl font-semibold leading-tight tracking-tight",
  "heading-xl": "text-2xl font-semibold leading-tight tracking-tight",
  "heading-lg": "text-xl font-semibold leading-snug tracking-normal",
  "heading-md": "text-lg font-semibold leading-snug tracking-normal",
  "heading-sm": "text-base font-semibold leading-snug tracking-normal",
  "body-lg": "text-lg font-normal leading-relaxed tracking-normal",
  "body-md": "text-base font-normal leading-normal tracking-normal",
  "body-sm": "text-sm font-normal leading-normal tracking-normal",
  label: "text-sm font-medium leading-normal tracking-normal",
  caption: "text-xs font-normal leading-normal tracking-normal",
  overline: "text-xs font-semibold leading-normal tracking-wider",
};
