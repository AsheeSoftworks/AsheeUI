/**
 * The AsheeUI configuration for Puck.
 *
 * This file is the registry the visual builder reads: every block, the category
 * it belongs to, and the page shell the published page renders into. It contains
 * no second implementation of any component. Each entry is the framework
 * component plus the serializable configuration a builder can own, so the same
 * component powers the React application, the editor and the published page.
 */

import type { Config } from "@puckeditor/core";
import { type ReactNode, useContext } from "react";
import { AsheeUIProvider } from "../AsheeUIProvider";
import { AsheeConfigContext } from "../libs/context";
import {
  type HeadingBlockProps,
  headingBlock,
  type TextBlockProps,
  textBlock,
} from "./blocks/content";
import {
  type ColumnsBlockProps,
  columnsBlock,
  type SectionBlockProps,
  sectionBlock,
} from "./blocks/layout";
import {
  type FooterBlockProps,
  footerBlock,
  type NavbarBlockProps,
  navbarBlock,
} from "./blocks/navigation";
import {
  type CtaBlockProps,
  ctaBlock,
  type FeatureGridBlockProps,
  featureGridBlock,
  type HeroBlockProps,
  heroBlock,
  type PricingCardBlockProps,
  pricingCardBlock,
  type TestimonialsBlockProps,
  testimonialsBlock,
} from "./blocks/sections";
import { type EmptyStateBlockProps, emptyStateBlock } from "./blocks/utility";

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
 * A block that appears in none of them is listed by the builder's own fallback
 * category, which is why the list stays explicit rather than complete by
 * accident.
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
 * Props of the published page's root, which is the framework's page shell.
 */
export type AsheePuckRootProps = {
  /** The page content the builder composed. */
  children?: ReactNode;
};

/**
 * The type of the AsheeUI Puck configuration.
 */
export type AsheePuckConfig = Config<{
  components: AsheePuckComponents;
  root: AsheePuckRootProps;
  categories: AsheePuckCategory[];
}>;

/**
 * The page shell a published page renders into.
 *
 * A block resolves its theme through the framework provider, so the shell
 * supplies one when the consumer has not. An existing provider is respected
 * rather than nested, so a consumer's own configuration (a default theme, a
 * component override) keeps applying to the built page.
 *
 * @param props - The page content.
 * @returns The rendered shell.
 */
function PuckRoot({ children }: AsheePuckRootProps) {
  const existingConfig = useContext(AsheeConfigContext);

  const page = (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      {children}
    </div>
  );

  return existingConfig ? page : <AsheeUIProvider>{page}</AsheeUIProvider>;
}

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
  },
  categories: {
    Layout: { title: "Layout", components: ["Section", "Columns"] },
    Navigation: { title: "Navigation", components: ["Navbar", "Footer"] },
    Hero: { title: "Hero", components: ["Hero"] },
    Content: { title: "Content", components: ["Heading", "Text"] },
    Features: { title: "Features", components: ["FeatureGrid"] },
    CTA: { title: "CTA", components: ["CTA"] },
    Pricing: { title: "Pricing", components: ["PricingCard"] },
    Testimonials: {
      title: "Testimonials",
      components: ["Testimonials"],
    },
    Utility: { title: "Utility", components: ["EmptyState"] },
  },
  root: {
    fields: {},
    defaultProps: {},
    render: ({ children }) => <PuckRoot>{children}</PuckRoot>,
  },
};
