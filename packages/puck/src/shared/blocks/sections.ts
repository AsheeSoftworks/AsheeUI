/**
 * The marketing section blocks, stated once for both renderers.
 *
 * These are the sections a page is assembled from: a hero, a feature grid, a
 * testimonial wall, a pricing card and a closing call to action. What is stated here is
 * the editor's half of each — its label, its fields and its starting value — so the two
 * platforms offer one editor and one default, and differ only in how each draws the
 * component it names.
 */

import type { ContainerSize, CtaPanel, SectionBackground } from "@asheeui/core";
import type { BuilderAction } from "../adapters";
import {
  ACTION_FIELDS,
  ALIGNMENT_OPTIONS,
  BACKGROUND_OPTIONS,
  COLUMNS_OPTIONS,
  CONTAINER_SIZE_OPTIONS,
  FEATURE_ITEM_FIELD,
  PRICING_FEATURE_FIELD,
  selectField,
  TESTIMONIAL_ITEM_FIELD,
  textareaField,
  textField,
} from "../fields";
import type { AsheeBlockSpec } from "../types";

/**
 * The props of the hero block.
 */
export type HeroBlockProps = {
  /** Short label above the headline. */
  eyebrow?: string;

  /** The headline. */
  title?: string;

  /** Supporting sentence under the headline. */
  description?: string;

  /** The emphasised action. */
  primaryAction?: BuilderAction;

  /** The supporting action. */
  secondaryAction?: BuilderAction;

  /** Alignment of the text column. */
  align?: "start" | "center";

  /** Background treatment of the band. */
  background?: SectionBackground;

  /** Maximum content width of the band. */
  contentWidth?: ContainerSize;
};

/**
 * The leading statement of a page.
 */
export const HERO_SPEC: AsheeBlockSpec<HeroBlockProps> = {
  label: "Hero",
  fields: {
    eyebrow: textField("Eyebrow"),
    title: textField("Headline", "Run your campaigns from one place"),
    description: textareaField("Description"),
    primaryAction: ACTION_FIELDS,
    secondaryAction: ACTION_FIELDS,
    align: selectField("Alignment", ALIGNMENT_OPTIONS),
    background: selectField("Background", BACKGROUND_OPTIONS),
    contentWidth: selectField("Content width", CONTAINER_SIZE_OPTIONS),
  },
  defaultProps: {
    eyebrow: "",
    title: "Run your campaigns from one place",
    description: "Messages, templates and results, without switching tools.",
    primaryAction: { label: "Start free", href: "/signup", variant: "solid" },
    secondaryAction: {
      label: "Book a demo",
      href: "/demo",
      variant: "bordered",
    },
    align: "start",
    background: "none",
    contentWidth: "lg",
  },
};

/**
 * The props of the call-to-action block.
 */
export type CtaBlockProps = {
  /** Short label above the headline. */
  eyebrow?: string;

  /** The headline of the band. */
  title?: string;

  /** Supporting sentence under the headline. */
  description?: string;

  /** The emphasised action. */
  primaryAction?: BuilderAction;

  /** The supporting action. */
  secondaryAction?: BuilderAction;

  /** Alignment of the content. */
  align?: "start" | "center";

  /** Background treatment of the band. */
  background?: SectionBackground;

  /** Panel treatment of the content. */
  panel?: CtaPanel;
};

/**
 * The closing call to action of a page.
 */
export const CTA_SPEC: AsheeBlockSpec<CtaBlockProps> = {
  label: "Call to action",
  fields: {
    eyebrow: textField("Eyebrow"),
    title: textField("Headline", "Send your first campaign today"),
    description: textareaField("Description"),
    primaryAction: ACTION_FIELDS,
    secondaryAction: ACTION_FIELDS,
    align: selectField("Alignment", ALIGNMENT_OPTIONS),
    background: selectField("Background", BACKGROUND_OPTIONS),
    panel: selectField("Panel", ["bordered", "muted", "plain"] as const),
  },
  defaultProps: {
    eyebrow: "",
    title: "Send your first campaign today",
    description: "No card required, and no setup call.",
    primaryAction: {
      label: "Create an account",
      href: "/signup",
      variant: "solid",
    },
    align: "center",
    background: "none",
    panel: "bordered",
  },
};

/**
 * The props of the feature grid block.
 */
export type FeatureGridBlockProps = {
  /** Short label above the heading. */
  eyebrow?: string;

  /** Heading of the band. */
  title?: string;

  /** Supporting sentence under the heading. */
  description?: string;

  /** The features to show. */
  items?: Array<{ title: string; description: string }>;

  /** Columns from the `md` breakpoint upwards. */
  columnsMd?: string;

  /** Columns from the `lg` breakpoint upwards. */
  columnsLg?: string;

  /** Alignment of the heading. */
  align?: "start" | "center";

  /** Background treatment of the band. */
  background?: SectionBackground;
};

/**
 * A band of features laid out in a responsive grid.
 */
export const FEATURE_GRID_SPEC: AsheeBlockSpec<FeatureGridBlockProps> = {
  label: "Feature grid",
  fields: {
    eyebrow: textField("Eyebrow"),
    title: textField("Heading", "Everything the campaign needs"),
    description: textareaField("Description"),
    items: FEATURE_ITEM_FIELD,
    columnsMd: selectField("Columns on tablet", COLUMNS_OPTIONS),
    columnsLg: selectField("Columns on desktop", COLUMNS_OPTIONS),
    align: selectField("Heading alignment", ALIGNMENT_OPTIONS),
    background: selectField("Background", BACKGROUND_OPTIONS),
  },
  defaultProps: {
    eyebrow: "",
    title: "Everything the campaign needs",
    description: "",
    items: [
      { title: "Templates", description: "Reusable messages." },
      { title: "Scheduling", description: "Send at the right time." },
      { title: "Reporting", description: "See what landed." },
    ],
    columnsMd: "2",
    columnsLg: "3",
    align: "center",
    background: "none",
  },
};

/**
 * The props of the testimonials block.
 */
export type TestimonialsBlockProps = {
  /** Short label above the heading. */
  eyebrow?: string;

  /** Heading of the band. */
  title?: string;

  /** Supporting sentence under the heading. */
  description?: string;

  /** The quotes to show. */
  items?: Array<{ quote: string; name: string; role: string }>;

  /** Alignment of the heading. */
  align?: "start" | "center";
};

/**
 * A band of attributed customer quotes.
 */
export const TESTIMONIALS_SPEC: AsheeBlockSpec<TestimonialsBlockProps> = {
  label: "Testimonials",
  fields: {
    eyebrow: textField("Eyebrow"),
    title: textField("Heading", "Teams send more with Ashee"),
    description: textareaField("Description"),
    items: TESTIMONIAL_ITEM_FIELD,
    align: selectField("Heading alignment", ALIGNMENT_OPTIONS),
  },
  defaultProps: {
    eyebrow: "",
    title: "Teams send more with Ashee",
    description: "",
    items: [
      {
        quote: "We cut campaign setup from hours to minutes.",
        name: "Ama Boateng",
        role: "Head of Growth, Kora Retail",
      },
    ],
    align: "center",
  },
};

/**
 * The props of the pricing card block.
 */
export type PricingCardBlockProps = {
  /** Name of the plan. */
  name?: string;

  /** The amount. */
  price?: string;

  /** Billing period shown beside the amount. */
  period?: string;

  /** One sentence about the plan. */
  description?: string;

  /** Short label above the plan name. */
  badge?: string;

  /** The plan's feature lines. */
  features?: Array<{ label: string; included: boolean }>;

  /** Whether the plan is the recommended one. */
  highlighted?: boolean;

  /** The emphasised action. */
  primaryAction?: BuilderAction;
};

/**
 * One plan in a pricing table.
 */
export const PRICING_CARD_SPEC: AsheeBlockSpec<PricingCardBlockProps> = {
  label: "Pricing card",
  fields: {
    badge: textField("Badge", "Most popular"),
    name: textField("Plan", "Growth"),
    price: textField("Price", "$29"),
    period: textField("Period", "/month"),
    description: textareaField("Description"),
    features: PRICING_FEATURE_FIELD,
    highlighted: {
      type: "radio",
      label: "Recommended plan",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    primaryAction: ACTION_FIELDS,
  },
  defaultProps: {
    badge: "",
    name: "Growth",
    price: "$29",
    period: "/month",
    description: "For teams sending their first campaigns.",
    features: [
      { label: "10,000 messages", included: true },
      { label: "Audit log", included: false },
    ],
    highlighted: false,
    primaryAction: {
      label: "Choose Growth",
      href: "/signup",
      variant: "solid",
    },
  },
};
