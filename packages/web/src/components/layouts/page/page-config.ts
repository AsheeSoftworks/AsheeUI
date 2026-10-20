/**
 * Page component configuration for AsheeUI.
 *
 * This file registers the values the page parts default to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve. The options
 * themselves, and the types that name them, live in `@asheeui/core`: they are the
 * framework's page contract rather than a web renderer's, and the native renderer reads the
 * same ones from the same place. What stays here is the web default values and the
 * registration that puts them in the web registry.
 */

import { type PageConfig, registerComponentDefaults } from "@asheeui/core";

export type { PageConfig } from "@asheeui/core";

/**
 * Default config values registered for the page parts.
 * Every option is registered so that the part which owns it resolves it: the containment and
 * the width on all three parts, the rhythm on the content area, the stickiness on the header
 * and the separators on the header and the footer. The shell itself applies none of them.
 */
export const defaultPageConfig: PageConfig = {
  contained: true,
  containerSize: "lg",
  spacing: "md",
  sticky: true,
  divider: true,
};

registerComponentDefaults("page", defaultPageConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_PAGE_CONFIG = {
  contained: true,
  containerSize: "lg",
  spacing: "md",
  sticky: true,
  divider: true,
} satisfies PageConfig;
