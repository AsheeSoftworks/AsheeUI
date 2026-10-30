/**
 * The typography vocabulary both renderers name, and the treatment each role stands for.
 *
 * Typography uses the same two-layer model as radius and colour: a semantic layer (roles)
 * resolves to a size/style layer, which each renderer turns into the classes it compiles. What
 * lives here is the first layer and the mapping between the two, because both renderers have to
 * agree on what a role *means*:
 *
 * - the six `TYPOGRAPHY_*_VALUES` arrays and the unions derived from them (`TypographySize`,
 *   `TypographyTone` and the rest). A type never moves: every `*Config` in core accepts this
 *   vocabulary, and the platform re-exports those configs, so a union in a renderer would split
 *   the configuration a shared file is written in (H17).
 * - `TypographyRoleTokens` and `TYPOGRAPHY_ROLE_TOKEN` — what each role resolves to. The platform
 *   is its only future reader and the web its only reader today, which is not a contradiction:
 *   B15 replaces the platform's private role table with this one instead of moving it here, and a
 *   table two renderers must agree on cannot be stated in one of them.
 * - `TypographyRole` — the role names, which are the vocabulary a prop states.
 *
 * The *classes* are the renderer's that compiles them. `TYPOGRAPHY_SIZE_CLASS` and the rest, with
 * `TYPOGRAPHY_ROLE_CLASS`, are in `packages/web/src/styles/typography.ts` (C2), and
 * `TYPOGRAPHY_ROLE_DEFAULT_ELEMENT` — the DOM element a role renders as — moved there in C3: an
 * element name is only the browser's, since a device draws a `Text` for every role.
 *
 * @see https://www.asheeui.com/components/typography/typography — the roles, the scale, and what each one renders as
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
 *
 * This table is the source the web's `TYPOGRAPHY_ROLE_CLASS` restates as complete static class
 * strings, and the table the web composes from when a consumer retunes a role: the two describe
 * one treatment, and the second cannot state a token the first does not. B15 makes the platform
 * read it too, so the two renderers stop keeping a role table each.
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
