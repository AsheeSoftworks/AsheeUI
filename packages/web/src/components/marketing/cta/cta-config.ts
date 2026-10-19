/**
 * CTA component configuration for AsheeUI.
 *
 * This file registers the values the CTA defaults to on the web, so the component-level
 * fallback tier of the theme cascade has a value to resolve. The options themselves, and the
 * types that name them, live in `@asheeui/core`: they are the framework's call-to-action
 * contract rather than a web renderer's, and the native renderer reads the same ones from the
 * same place. What stays here is the web default values and the registration that puts them
 * in the web registry.
 */

import { type CtaConfig, registerComponentDefaults } from "@asheeui/core";

export type { CtaConfig, CtaPanel } from "@asheeui/core";

/**
 * Default config values registered for the CTA component.
 */
export const defaultCtaConfig: CtaConfig = {
  align: "center",
  spacing: "lg",
  background: "none",
  panel: "bordered",
  containerSize: "lg",
  contained: true,
};

registerComponentDefaults("cta", defaultCtaConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_CTA_CONFIG: Required<CtaConfig> = {
  align: "center",
  spacing: "lg",
  background: "none",
  panel: "bordered",
  containerSize: "lg",
  contained: true,
};
