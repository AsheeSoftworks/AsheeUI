/**
 * Footer component configuration for AsheeUI.
 *
 * This file registers the values the Footer defaults to on the web, so the component-level
 * fallback tier of the theme cascade has a value to resolve. The options themselves, and the
 * types that name them, live in `@asheeui/core`: they are the framework's footer contract
 * rather than a web renderer's, and the native renderer reads the same ones from the same
 * place. What stays here is the web default values and the registration that puts them in the
 * web registry.
 */

import { type FooterConfig, registerComponentDefaults } from "@asheeui/core";

export type {
  FooterConfig,
  FooterGroup,
  FooterLinkItem,
  FooterVariant,
} from "@asheeui/core";

/**
 * Default config values registered for the Footer component.
 */
export const defaultFooterConfig: FooterConfig = {
  variant: "bordered",
  spacing: "lg",
  contained: true,
  containerSize: "lg",
};

registerComponentDefaults("footer", defaultFooterConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_FOOTER_CONFIG: Required<FooterConfig> = {
  variant: "bordered",
  spacing: "lg",
  contained: true,
  containerSize: "lg",
};
