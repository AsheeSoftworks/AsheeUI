/**
 * The platform marketing section blocks.
 *
 * Each one is a thin adapter over the framework component of the same name, so the
 * builder edits the component's own props rather than a parallel model of them — and it
 * edits them once, for both platforms: the label, the fields and the defaults come from
 * `src/shared`, and what is written here is only how the component is drawn on a device.
 */

import {
  CTA,
  FeatureGrid,
  Hero,
  PricingCard,
  Testimonials,
} from "@asheeui/native";
import type {
  AsheeBlock,
  CtaBlockProps,
  FeatureGridBlockProps,
  HeroBlockProps,
  PricingCardBlockProps,
  TestimonialsBlockProps,
} from "../../shared";
import {
  CTA_SPEC,
  FEATURE_GRID_SPEC,
  HERO_SPEC,
  PRICING_CARD_SPEC,
  TESTIMONIALS_SPEC,
  toAction,
  toColumns,
} from "../../shared";

/**
 * The leading statement of a page.
 */
export const heroBlock: AsheeBlock<HeroBlockProps> = {
  ...HERO_SPEC,
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
 * The closing call to action of a page.
 */
export const ctaBlock: AsheeBlock<CtaBlockProps> = {
  ...CTA_SPEC,
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
 * A band of features laid out in a responsive grid.
 */
export const featureGridBlock: AsheeBlock<FeatureGridBlockProps> = {
  ...FEATURE_GRID_SPEC,
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
 * A band of attributed customer quotes.
 */
export const testimonialsBlock: AsheeBlock<TestimonialsBlockProps> = {
  ...TESTIMONIALS_SPEC,
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
 * One plan in a pricing table.
 */
export const pricingCardBlock: AsheeBlock<PricingCardBlockProps> = {
  ...PRICING_CARD_SPEC,
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
  ),
};
