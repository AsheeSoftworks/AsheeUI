/**
 * The block specs, gathered.
 *
 * One module states the set: the names a stored page uses, the order a builder lists
 * them in, and the categories they are filed under. A block that is added without a
 * category, or a category that names a block nobody implemented, is caught by the
 * package's own tests rather than by an editor that silently shows nothing — which is
 * why the name list and the category map live beside the specs rather than in either
 * renderer.
 */

import type { AsheeBlockSpec, AsheePuckCategories } from "../types";
import { HEADING_SPEC, TEXT_SPEC } from "./content";
import { COLUMNS_SPEC, SECTION_SPEC } from "./layout";
import { FOOTER_SPEC, NAVBAR_SPEC } from "./navigation";
import {
  CTA_SPEC,
  FEATURE_GRID_SPEC,
  HERO_SPEC,
  PRICING_CARD_SPEC,
  TESTIMONIALS_SPEC,
} from "./sections";
import { EMPTY_STATE_SPEC } from "./utility";

export * from "./content";
export * from "./layout";
export * from "./navigation";
export * from "./sections";
export * from "./utility";

/**
 * The blocks a stored page can name, in the order a builder lists them.
 */
export const PUCK_BLOCK_NAMES = [
  "Section",
  "Columns",
  "Heading",
  "Text",
  "Navbar",
  "Footer",
  "Hero",
  "CTA",
  "FeatureGrid",
  "Testimonials",
  "PricingCard",
  "EmptyState",
] as const;

/**
 * The name of one block, which is also its key in a page's content.
 */
export type PuckBlockName = (typeof PUCK_BLOCK_NAMES)[number];

/**
 * The specs, by block name.
 *
 * This is the one place the set is complete: a name without a spec, or a spec without a
 * name, is a compile error rather than an editor that silently shows nothing, and both
 * registries read their labels and fields from what is here. A consumer building its own
 * registry — an application that wants a subset of the blocks, or one of its own beside
 * them — can start from the same specs rather than restating the fields.
 */
export const PUCK_SPECS: Record<
  PuckBlockName,
  AsheeBlockSpec<Record<string, unknown>>
> = {
  Section: SECTION_SPEC,
  Columns: COLUMNS_SPEC,
  Heading: HEADING_SPEC,
  Text: TEXT_SPEC,
  Navbar: NAVBAR_SPEC,
  Footer: FOOTER_SPEC,
  Hero: HERO_SPEC,
  CTA: CTA_SPEC,
  FeatureGrid: FEATURE_GRID_SPEC,
  Testimonials: TESTIMONIALS_SPEC,
  PricingCard: PRICING_CARD_SPEC,
  EmptyState: EMPTY_STATE_SPEC,
};

/**
 * The categories a block can be filed under.
 *
 * A block that appears in none of them is listed by the builder's own fallback
 * category, which is why the list stays explicit rather than complete by accident.
 */
export const PUCK_CATEGORIES: AsheePuckCategories = {
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
};
