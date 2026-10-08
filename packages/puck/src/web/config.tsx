"use client";

/**
 * The AsheeUI configuration for Puck, on the web.
 *
 * This file is the registry the visual builder reads: every block, the category it
 * belongs to, and the page shell a published page renders into. It contains no second
 * implementation of any component. Each entry is the framework component plus the
 * serializable configuration a builder can own, and the configuration half comes from
 * `src/shared`, so the web editor and the native renderer offer one editor for one
 * block.
 *
 * One assertion is made here and nowhere else: the components map and the category map
 * are asserted to be the shape the editor's own `Config` describes. It is the single
 * point where this package's platform-free field vocabulary meets the editor's, and a
 * cast is what keeps the two descriptions from having to be one type in both halves —
 * the native entry could not load if they were.
 */

import type { Config } from "@puckeditor/core";
import type {
  AsheePuckRootProps,
  CtaBlockProps,
  EmptyStateBlockProps,
  FeatureGridBlockProps,
  FooterBlockProps,
  HeadingBlockProps,
  HeroBlockProps,
  NavbarBlockProps,
  PricingCardBlockProps,
  TestimonialsBlockProps,
  TextBlockProps,
} from "../shared";
import { PUCK_CATEGORIES } from "../shared";
import { headingBlock, textBlock } from "./blocks/content";
import {
  type ColumnsBlockProps,
  columnsBlock,
  type SectionBlockProps,
  sectionBlock,
} from "./blocks/layout";
import { footerBlock, navbarBlock } from "./blocks/navigation";
import {
  ctaBlock,
  featureGridBlock,
  heroBlock,
  pricingCardBlock,
  testimonialsBlock,
} from "./blocks/sections";
import { emptyStateBlock } from "./blocks/utility";
import { PuckRoot } from "./root";

/**
 * Every block the AsheeUI configuration offers, with its props.
 */
export type AsheePuckComponents = {
  /** A band with vertical rhythm and a background. */
  Section: SectionBlockProps;

  /** A two-column arrangement that stacks on a narrow screen. */
  Columns: ColumnsBlockProps;

  /** A section heading. */
  Heading: HeadingBlockProps;

  /** A paragraph of body text. */
  Text: TextBlockProps;

  /** The navigation bar of a page. */
  Navbar: NavbarBlockProps;

  /** The footer of a page. */
  Footer: FooterBlockProps;

  /** The leading statement of a page. */
  Hero: HeroBlockProps;

  /** The closing call to action of a page. */
  CTA: CtaBlockProps;

  /** A band of features in a responsive grid. */
  FeatureGrid: FeatureGridBlockProps;

  /** A band of attributed customer quotes. */
  Testimonials: TestimonialsBlockProps;

  /** One plan in a pricing table. */
  PricingCard: PricingCardBlockProps;

  /** A region with nothing in it. */
  EmptyState: EmptyStateBlockProps;
};

/**
 * The categories a block can be filed under.
 */
export type AsheePuckCategory =
  | "Layout"
  | "Navigation"
  | "Hero"
  | "Content"
  | "Features"
  | "CTA"
  | "Pricing"
  | "Testimonials"
  | "Utility";

/**
 * The type of the AsheeUI Puck configuration.
 */
export type AsheePuckConfig = Config<{
  components: AsheePuckComponents;
  root: AsheePuckRootProps;
  categories: AsheePuckCategory[];
}>;

/**
 * The AsheeUI blocks, filed under the categories the builder shows.
 */
export const asheePuckConfig: AsheePuckConfig = {
  components: {
    Section: sectionBlock,
    Columns: columnsBlock,
    Heading: headingBlock,
    Text: textBlock,
    Navbar: navbarBlock,
    Footer: footerBlock,
    Hero: heroBlock,
    CTA: ctaBlock,
    FeatureGrid: featureGridBlock,
    Testimonials: testimonialsBlock,
    PricingCard: pricingCardBlock,
    EmptyState: emptyStateBlock,
  } as unknown as AsheePuckConfig["components"],
  categories: PUCK_CATEGORIES as unknown as AsheePuckConfig["categories"],
  root: {
    fields: {},
    defaultProps: {},
    render: ({ children }) => <PuckRoot>{children}</PuckRoot>,
  },
};
