/**
 * Types for the end-to-end gallery.
 *
 * A section pairs the markup a playground renders with the contract that markup
 * must satisfy. The contract is expressed as plain functions that return problem
 * descriptions rather than as test-framework assertions, so the same contract
 * runs against a framework's server markup, against the hydrated DOM in the
 * browser environment, and inside this package's own test without depending on
 * an assertion library.
 */

import type { ComponentType, ElementType } from "react";

/**
 * Props every gallery section receives.
 *
 * Only the sections that render a link or a picture use them; the rest accept
 * and ignore them, which keeps the gallery a uniform list.
 */
export interface GallerySectionProps {
  /**
   * Framework link component, substituted into the sections that render links.
   * Left out, the sections render plain anchors.
   */
  linkComponent?: ElementType;

  /**
   * Framework image component, substituted into the avatar's picture.
   * Left out, the picture renders through the framework's `Image` primitive.
   */
  imageComponent?: ElementType;

  /**
   * Props passed to the substituted link component, which is how a framework's
   * router link receives its own destination and the playground marks the
   * anchors it produced.
   */
  linkProps?: Record<string, unknown>;

  /**
   * Props passed to the substituted image component, which is how a framework's
   * image receives its own options and the playground marks the picture it
   * produced.
   */
  imageProps?: Record<string, unknown>;
}

/**
 * One gallery section.
 *
 * `inspect` is checked twice in every playground: once against the markup the
 * framework produced on the server, and once against the same tree after it has
 * hydrated. A section that renders differently on the client therefore fails the
 * contract instead of only failing a hydration warning that nobody reads.
 */
export interface GallerySection {
  /** Stable identifier, also used as the section element's id. */
  id: string;

  /** Human-readable title rendered above the section. */
  title: string;

  /** The section's content, which receives the gallery's substitution props. */
  Component: ComponentType<GallerySectionProps>;

  /**
   * Checks the section's markup and accessibility contract.
   *
   * @param root - The document, a container, or the parsed server markup.
   * @returns One description per problem; empty when the section is correct.
   */
  inspect: (root: ParentNode) => string[];

  /**
   * Whether the section only becomes visible or usable in a browser, which is
   * the case for anything that opens on interaction.
   */
  isInteractive?: boolean;

  /**
   * A consumer interaction the section supports.
   *
   * Held inside the section so its markup, its contract and its behaviour stay
   * in one place; `GALLERY_INTERACTIONS` lifts them into a flat list.
   */
  interaction?: {
    /** What the interaction does, in one line. */
    description: string;

    /**
     * Performs the interaction against a hydrated tree.
     *
     * @param container - The hydrated tree's container element.
     * @returns One description per problem; empty when the interaction behaved.
     */
    run: (container: HTMLElement) => Promise<string[]>;
  };
}

/** One interaction a consumer performs, and what it must reveal. */
export interface GalleryInteraction {
  /** Identifier of the section the interaction belongs to. */
  id: string;

  /** What the interaction does, in one line. */
  description: string;

  /**
   * Performs the interaction.
   *
   * @param container - The hydrated tree's container element.
   * @returns One description per problem; empty when the interaction behaved.
   */
  run: (container: HTMLElement) => Promise<string[]>;
}

/** Collects problems while one part of the gallery is checked. */
export interface Report {
  /** Names the thing being checked, so a problem says where it came from. */
  where: string;

  /** Every problem found, in the order it was found. */
  problems: string[];
}
