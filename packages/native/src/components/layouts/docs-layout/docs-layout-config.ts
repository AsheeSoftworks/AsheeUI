/**
 * DocsLayout configuration for the native package.
 *
 * The options are the ones the framework's docs-layout contract names, so `components.docslayout`
 * is configured the same way on both platforms, and the types are re-exported from `@asheeui/core`
 * rather than restated here. What stays with the renderer is the value each option defaults to on
 * the platform, and the registration that puts it in the native registry.
 */

import type { DocsLayoutConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type { DocsLayoutConfig } from "@asheeui/core";

/**
 * Configuration options for the native DocsLayout.
 *
 * @deprecated Use {@link DocsLayoutConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeDocsLayoutConfig = DocsLayoutConfig;

/**
 * The defaults the DocsLayout registers with the native registry.
 *
 * They are the web's own values, including the two landmark names: the platform states those
 * names as the titles of the sections it stacks, so an application that names its navigation
 * region once names it on both platforms.
 *
 * @deprecated Use {@link defaultDocsLayoutConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeDocsLayoutConfig: NativeDocsLayoutConfig = {
  navigationLabel: "Documentation",
  tocLabel: "On this page",
  navigationWidth: "md",
  stickyNavigation: true,
  stickyToc: true,
  skipLink: true,
  skipLinkLabel: "Skip to content",
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    docslayout: NativeDocsLayoutConfig;
  }
}

registerNativeComponentDefaults("docslayout", defaultNativeDocsLayoutConfig);

/**
 * The values the composition falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_DOCS_LAYOUT_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_DOCS_LAYOUT_CONFIG = {
  navigationLabel: "Documentation",
  tocLabel: "On this page",
  navigationWidth: "md",
  stickyNavigation: true,
  stickyToc: true,
  skipLink: true,
  skipLinkLabel: "Skip to content",
} satisfies NativeDocsLayoutConfig;
