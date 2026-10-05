/**
 * The Accordion's configuration face, shared by both platforms.
 *
 * An accordion is a stack of sections a reader opens one at a time, and both platforms
 * ask it the same questions: how the sections are drawn, how dense they are, how round
 * their corners are, whether more than one may be open, and whether opening one moves.
 * Those are named here, once, so `components.accordion` means the same thing in a web
 * application and in a native one.
 *
 * The item shape is shared for the same reason: what an item *is* — a title, its
 * content, an optional subtitle, an optional icon and whether it can be opened — is a
 * statement about the component rather than about a platform. How a renderer animates
 * the opening is its own; the web transitions a grid row and the platform animates the
 * layout change with its own animator.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `accordion` here is what makes `components.accordion` a known
 * configuration section without either renderer restating it.
 */

import type { ReactNode } from "react";
import type { Radius, Size } from "../shared/radius";

/**
 * Visual style of the accordion.
 *
 * - `bordered`: items sit in one grouped, outlined container.
 * - `separated`: each item is its own rounded, outlined block.
 * - `ghost`: transparent items with a divider between them.
 * - `flush`: no container, borders or dividers.
 */
export type AccordionVariant = "bordered" | "separated" | "ghost" | "flush";

/**
 * Padding and spacing scale used by accordion headers and content.
 */
export type AccordionSizeKey = Size;

/**
 * A single accordion entry.
 */
export interface AccordionItem {
  /**
   * Unique key for the item.
   *
   * An item without one is identified by its position, which is what a list without
   * ids means.
   */
  id?: string;

  /** The item's header label. */
  title: ReactNode;

  /** The content revealed under the header. */
  content: ReactNode;

  /** Secondary text shown under the title. */
  subtitle?: ReactNode;

  /** Content shown before the title. */
  icon?: ReactNode;

  /**
   * Whether the item's trigger is disabled.
   * A disabled item cannot be opened or closed by the reader.
   *
   * @default false
   */
  disabled?: boolean;
}

/**
 * Configuration options for the Accordion.
 *
 * Set under `components.accordion` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface AccordionConfig {
  /**
   * Visual style variant.
   *
   * @default "separated"
   */
  variant?: AccordionVariant;

  /**
   * Padding and spacing scale.
   *
   * @default "md"
   */
  size?: AccordionSizeKey;

  /**
   * Corner rounding.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Whether more than one item may stay open.
   * When false, opening one item closes the others, which is what an accordion is for.
   *
   * @default false
   */
  allowMultiple?: boolean;

  /**
   * Whether opening and closing happen without animation.
   *
   * @default false
   */
  disableAnimation?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    accordion: AccordionConfig;
  }
}
