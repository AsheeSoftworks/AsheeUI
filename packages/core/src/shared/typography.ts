/**
 * Typography token definitions for AsheeUI.
 *
 * Typography uses the same two-layer model as radius and colour: a semantic
 * layer (roles) resolves to a size/style layer, which resolves to complete,
 * static Tailwind class strings. This file holds the types and the mappings;
 * the public `Typography` component consumes them.
 *
 * @see https://www.asheeui.com/components/typography/typography — the roles, the scale and what each element is
 * specification) for the rationale, the role table and the compatibility notes.
 */

/** The available typography size tokens. */
export const TYPOGRAPHY_SIZE_VALUES = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
] as const;

export type TypographySize = (typeof TYPOGRAPHY_SIZE_VALUES)[number];

/** The available font-weight tokens. */
export const TYPOGRAPHY_WEIGHT_VALUES = [
  "normal",
  "medium",
  "semibold",
  "bold",
] as const;

export type TypographyWeight = (typeof TYPOGRAPHY_WEIGHT_VALUES)[number];

/** The available line-height tokens. */
export const TYPOGRAPHY_LEADING_VALUES = [
  "tight",
  "snug",
  "normal",
  "relaxed",
  "loose",
] as const;

export type TypographyLeading = (typeof TYPOGRAPHY_LEADING_VALUES)[number];

/** The available letter-spacing tokens. */
export const TYPOGRAPHY_TRACKING_VALUES = [
  "tighter",
  "tight",
  "normal",
  "wide",
  "wider",
  "widest",
] as const;

export type TypographyTracking = (typeof TYPOGRAPHY_TRACKING_VALUES)[number];

/**
 * The semantic typography roles.
 * A role describes why text exists and resolves to a complete treatment.
 */
export type TypographyRole =
  | "display"
  // A page's own title: the same treatment as `heading-lg`, and the element a document outline expects (`h1`).
  // It exists as a role rather than an element override because a shared component has to state the meaning once,
  // and the web's `as` prop is not something the platform can accept.
  | "page-title"
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
export const TYPOGRAPHY_TONE_VALUES = [
  "default",
  "muted",
  "disabled",
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
  "none",
] as const;

export type TypographyTone = (typeof TYPOGRAPHY_TONE_VALUES)[number];

/** Text alignment options. */
export const TYPOGRAPHY_ALIGN_VALUES = [
  "left",
  "center",
  "right",
  "justify",
] as const;

export type TypographyAlign = (typeof TYPOGRAPHY_ALIGN_VALUES)[number];

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
  "page-title": {
    size: "xl",
    weight: "semibold",
    leading: "snug",
    tracking: "normal",
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
  // The page's title is the document's top-level heading; every other heading role is one level down from it.
  "page-title": "h1",
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
