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
 * Contained, sticky and divider are the shell's shape and are pinned; the width and the
 * rhythm are stated as well, so a page reads the same wherever it is rendered.
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
export const FALLBACK_PAGE_CONFIG: Required<PageConfig> = {
  contained: true,
  containerSize: "lg",
  spacing: "md",
  sticky: true,
  divider: true,
};
