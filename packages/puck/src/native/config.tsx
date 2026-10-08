/**
 * The AsheeUI registry, on the platform.
 *
 * The native twin of the web configuration: every block a stored page can name, the
 * categories they are filed under, and the page shell a stored page renders into. It
 * exists so that a device renders the page the editor composed — not a second page
 * model of it — and so that adding a block is one addition in `src/shared` plus one
 * drawing per platform.
 *
 * The category map and the block labels come from `src/shared`, which is what keeps the
 * two registries honest: neither can offer a category the other does not, and neither
 * can offer a block the other has not.
 */

import type { AsheeNativePuckConfig } from "../shared";
import { PUCK_CATEGORIES } from "../shared";
import { headingBlock, textBlock } from "./blocks/content";
import { columnsBlock, sectionBlock } from "./blocks/layout";
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
 * The blocks a stored page can name.
 *
 * The assertion is deliberate and it is the one place this package asserts rather than
 * checks: a registry holds blocks of different props, so the collection's type is the
 * open one, while each entry keeps its own type where it is declared. The package's own
 * tests assert the two properties that matter here — that every block in the registry
 * renders, and that the category map names exactly the blocks that exist.
 */
const components = {
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
} as unknown as AsheeNativePuckConfig["components"];

/**
 * The native registry a stored page is rendered with.
 */
export const asheeNativePuckConfig: AsheeNativePuckConfig = {
  components,
  categories: PUCK_CATEGORIES,
  root: {
    label: "Page",
    fields: {},
    defaultProps: {},
    render: ({ children }) => <PuckRoot>{children}</PuckRoot>,
  },
};
