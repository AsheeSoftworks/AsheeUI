/**
 * Accordion configuration for the native package.
 *
 * The options are the ones the framework's accordion contract names, so
 * `components.accordion` is configured the same way on both platforms, and the types are
 * re-exported from `@asheeui/core` rather than restated here. What stays with the renderer
 * is the value each option defaults to on the platform, and the registration that puts it
 * in the native registry.
 *
 * `variant` is deliberately absent, as it is on the web: a global `defaultVariant` states
 * how a filled control is drawn, and the accordion has no treatment for it, so the
 * component resolves an unknown treatment to the one it documents — the same fallback the
 * web accordion uses.
 */

import type { AccordionConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type {
  AccordionConfig,
  AccordionItem,
  AccordionSizeKey,
  AccordionVariant,
} from "@asheeui/core";

/**
 * Configuration options for the native Accordion.
 *
 * @deprecated Use {@link AccordionConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeAccordionConfig = AccordionConfig;

/**
 * The defaults the Accordion registers with the native registry.
 *
 * @deprecated Use {@link defaultAccordionConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeAccordionConfig: NativeAccordionConfig = {
  size: "md",
  allowMultiple: false,
  disableAnimation: false,
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    accordion: NativeAccordionConfig;
  }
}

registerNativeComponentDefaults("accordion", defaultNativeAccordionConfig);

/**
 * The values the accordion falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_ACCORDION_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_ACCORDION_CONFIG = {
  size: "md",
  variant: "separated",
  radius: "md",
  allowMultiple: false,
  disableAnimation: false,
} as const;
