/**
 * Marketing section blocks for Puck.
 *
 * These blocks are the sections a page is assembled from: a hero, a feature
 * grid, a testimonial wall, a pricing card and a closing call to action. Each
 * one is a thin adapter over the framework component of the same name, so the
 * builder edits the component's own props rather than a parallel model of them.
 */

import type { ComponentConfig } from "@puckeditor/core";
import type { ContainerSize } from "../../components/container/container-config";
import { CTA } from "../../components/cta/CTA";
import { FeatureGrid } from "../../components/feature-grid/FeatureGrid";
import { Hero } from "../../components/hero/Hero";
import { PricingCard } from "../../components/pricing-card/PricingCard";
import type { SectionBackground } from "../../components/section/section-config";
import { Testimonials } from "../../components/testimonials/Testimonials";
import { type BuilderAction, toAction, toColumns } from "../adapters";
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

/**
 * Configuration of the hero block.
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
export const heroBlock: ComponentConfig<HeroBlockProps> = {
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
  render: ({
    eyebrow,
    title,
    description,
    primaryAction,
    secondaryAction,
    align,
    background,
    contentWidth,
  }) => (
    <Hero
      eyebrow={eyebrow || undefined}
      title={title ?? ""}
      description={description || undefined}
      primaryAction={toAction(primaryAction)}
      secondaryAction={toAction(secondaryAction)}
      align={align ?? "start"}
      background={background ?? "none"}
      containerSize={contentWidth ?? "lg"}
    />
  ),
};

/**
 * Configuration of the call-to-action block.
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
  panel?: "bordered" | "muted" | "plain";
};

/**
 * The closing call to action of a page.
 */
export const ctaBlock: ComponentConfig<CtaBlockProps> = {
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
  render: ({
    eyebrow,
    title,
    description,
    primaryAction,
    secondaryAction,
    align,
    background,
    panel,
  }) => (
    <CTA
      eyebrow={eyebrow || undefined}
      title={title ?? ""}
      description={description || undefined}
      primaryAction={toAction(primaryAction)}
      secondaryAction={toAction(secondaryAction)}
      align={align ?? "center"}
      background={background ?? "none"}
      panel={panel ?? "bordered"}
    />
  ),
};

/**
 * Configuration of the feature grid block.
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
export const featureGridBlock: ComponentConfig<FeatureGridBlockProps> = {
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
  render: ({
    eyebrow,
    title,
    description,
    items,
    columnsMd,
    columnsLg,
    align,
    background,
  }) => (
    <FeatureGrid
      eyebrow={eyebrow || undefined}
      title={title || undefined}
      description={description || undefined}
      align={align ?? "center"}
      background={background ?? "none"}
      columnsMd={toColumns(columnsMd)}
      columnsLg={toColumns(columnsLg)}
      items={(items ?? []).map((item, index) => ({
        id: index,
        title: item.title ?? "",
        description: item.description || undefined,
      }))}
    />
  ),
};

/**
 * Configuration of the testimonials block.
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
export const testimonialsBlock: ComponentConfig<TestimonialsBlockProps> = {
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
  render: ({ eyebrow, title, description, items, align }) => (
    <Testimonials
      eyebrow={eyebrow || undefined}
      title={title || undefined}
      description={description || undefined}
      align={align ?? "center"}
      items={(items ?? []).map((item, index) => ({
        id: index,
        quote: item.quote ?? "",
        name: item.name ?? "",
        role: item.role || undefined,
      }))}
    />
  ),
};

/**
 * Configuration of the pricing card block.
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
export const pricingCardBlock: ComponentConfig<PricingCardBlockProps> = {
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
  render: ({
    badge,
    name,
    price,
    period,
    description,
    features,
    highlighted,
    primaryAction,
  }) => (
    <div className="p-6">
      <PricingCard
        badge={badge || undefined}
        name={name ?? ""}
        price={price ?? ""}
        period={period || undefined}
        description={description || undefined}
        highlighted={highlighted ?? false}
        features={(features ?? []).map((feature, index) => ({
          id: index,
          label: feature.label ?? "",
          included: feature.included !== false,
        }))}
        primaryAction={toAction(primaryAction)}
      />
    </div>
  ),
};
