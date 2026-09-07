/**
 * Accordion component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Accordion
 * component, including variant, size, radius, and behavior options.
 * It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius, Size } from "../../shared";

/**
 * Visual style of the accordion.
 *
 * - `bordered`: Items sit in one grouped, outlined container.
 * - `separated`: Each item is its own rounded, outlined block.
 * - `ghost`: Transparent items with a divider between them.
 * - `flush`: No container, borders, or dividers.
 */
export type AccordionVariant = "bordered" | "separated" | "ghost" | "flush";

/**
 * Padding and spacing scale used by accordion headers and content.
 * Maps to the standard Size type: "sm", "md", or "lg".
 */
export type AccordionSizeKey = Size;

/**
 * A single accordion entry.
 */
export interface AccordionItem {
  /**
   * Unique key for the item.
   *
   * When omitted, the item's `title` is used as the key.
   */
  id?: string;

  /**
   * Item header label.
   */
  title: ReactNode;

  /**
   * Expandable content rendered below the header.
   */
  content: ReactNode;

  /**
   * Optional secondary text shown under the title.
   */
  subtitle?: ReactNode;

  /**
   * Optional leading icon rendered before the title.
   */
  icon?: ReactNode;

  /**
   * Disables the item's trigger when `true`.
   * Disabled items cannot be opened or closed by the user.
   *
   * @default false
   */
  disabled?: boolean;
}

/**
 * Theme configuration options for the Accordion component.
 *
 * These values feed the component-level fallback tier and can be set
 * under `components.accordion` in the AsheeUI config.
 */
export interface AccordionConfig {
  /**
   * Visual style variant.
   * Controls the container and item appearance.
   *
   * @default "separated"
   */
  variant?: AccordionVariant;

  /**
   * Padding and spacing scale.
   * Controls the density of headers and content panels.
   *
   * @default "md"
   */
  size?: AccordionSizeKey;

  /**
   * Corner rounding.
   * Controls the border-radius of the container or individual items.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Allows more than one item to stay open at a time.
   * When false, opening one item closes all others.
   *
   * @default false
   */
  allowMultiple?: boolean;

  /**
   * Disables all expand/collapse animations.
   * When true, items open and close instantly without transitions.
   *
   * @default false
   */
  disableAnimation?: boolean;
}

/**
 * Default config values registered for the Accordion component.
 *
 * Note: `variant` and `radius` are intentionally absent so they can
 * inherit from the global `defaultVariant` / `defaultRadius`.
 */
export const defaultAccordionConfig: AccordionConfig = {
  size: "md",
  allowMultiple: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    accordion: AccordionConfig;
  }
}

registerComponentDefaults("accordion", defaultAccordionConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when all other cascade tiers (instance prop,
 * component config, and global default) are undefined.
 */
export const FALLBACK_ACCORDION_CONFIG = {
  size: "md",
  variant: "separated",
  radius: "md",
  allowMultiple: false,
} as const;
