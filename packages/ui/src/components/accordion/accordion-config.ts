import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";

/**
 * Visual style of the accordion.
 *
 * - `bordered`: Items sit in one grouped, outlined container.
 * - `separated`: Each item is its own rounded, outlined block.
 * - `ghost`: Transparent items with a divider between them.
 * - `flush`: No container, borders, or dividers.
 */
export type AccordionVariant = "bordered" | "separated" | "ghost" | "flush";

/** Padding and spacing scale used by accordion headers and content. */
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
  /** Item header label. */
  title: ReactNode;
  /** Expandable content rendered below the header. */
  content: ReactNode;
  /** Optional secondary text shown under the title. */
  subtitle?: ReactNode;
  /** Optional leading icon rendered before the title. */
  icon?: ReactNode;
  /** Disables the item's trigger when `true`.
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
  /** Visual style variant.
   *
   * @default "separated"
   */
  variant?: AccordionVariant;
  /** Padding and spacing scale.
   *
   * @default "md"
   */
  size?: AccordionSizeKey;
  /** Corner rounding.
   *
   * @default "md"
   */
  radius?: Radius;
  /** Allows more than one item to stay open at a time.
   *
   * @default false
   */
  allowMultiple?: boolean;
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
 */
export const FALLBACK_ACCORDION_CONFIG = {
  size: "md",
  variant: "separated",
  radius: "md",
  allowMultiple: false,
} as const;
