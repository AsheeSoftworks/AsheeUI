/**
 * Accordion component configuration for AsheeUI.
 * This file registers the values the Accordion component defaults to on the web, so
 * the component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the types that name them, live in `@asheeui/core`:
 * they are the framework's accordion contract rather than a web renderer's, and the
 * native renderer reads the same ones from the same place.
 */

import { type AccordionConfig, registerComponentDefaults } from "@asheeui/core";

export type {
  AccordionConfig,
  AccordionItem,
  AccordionSizeKey,
  AccordionVariant,
} from "@asheeui/core";

/**
 * Default config values registered for the Accordion component.
 *
 * `variant` and `radius` are intentionally absent so they can inherit from the global
 * `defaultVariant` / `defaultRadius`.
 */
export const defaultAccordionConfig: AccordionConfig = {
  size: "md",
  allowMultiple: false,
};

registerComponentDefaults("accordion", defaultAccordionConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_ACCORDION_CONFIG = {
  size: "md",
  variant: "separated",
  radius: "md",
  allowMultiple: false,
  disableAnimation: false,
} as const;
