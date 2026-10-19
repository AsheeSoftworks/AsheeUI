/**
 * DocsLayout component configuration for AsheeUI.
 *
 * This file registers the values the documentation composition defaults to on the web, so the
 * component-level tier of the theme cascade has a value to resolve. The options themselves, and
 * the types that name them, live in `@asheeui/core`: they are the framework's docs-layout
 * contract rather than a web renderer's, and the native renderer reads the same ones from the
 * same place. What stays here is the web default values and the registration that puts them in
 * the web registry.
 */

import {
  type DocsLayoutConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type { DocsLayoutConfig } from "@asheeui/core";

/**
 * Default config values registered for the DocsLayout component.
 */
export const defaultDocsLayoutConfig: DocsLayoutConfig = {
  navigationLabel: "Documentation",
  tocLabel: "On this page",
  navigationWidth: "md",
  stickyToc: true,
  skipLink: true,
  skipLinkLabel: "Skip to content",
};

registerComponentDefaults("docslayout", defaultDocsLayoutConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_DOCS_LAYOUT_CONFIG: Required<DocsLayoutConfig> = {
  navigationLabel: "Documentation",
  tocLabel: "On this page",
  navigationWidth: "md",
  stickyToc: true,
  skipLink: true,
  skipLinkLabel: "Skip to content",
};
