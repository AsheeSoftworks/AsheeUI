/**
 * SSR helper (`TEST-023`, `TEST-034`).
 *
 * Renders a tree to a string so server rendering is exercised without a
 * browser-only code path. The tree is wrapped in `AsheeUIProvider`, because
 * components resolve their configuration through the framework context and
 * throw outside it, exactly as they do in a consumer application.
 *
 * Effects do not run during server rendering, so a component that touches
 * browser globals only inside effects is covered by this helper; a component
 * that touches browser globals during render fails here.
 *
 * Note: this helper runs in the configured test environment, which is jsdom for
 * the component suite. Use a file-level `// @vitest-environment node` docblock
 * when the proof must be that no DOM globals exist at all, as the Typography
 * server-rendering test does.
 */

import { createElement, type ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { AsheeUIProvider } from "../AsheeUIProvider";
import type { ExternalConfig } from "../config/config";

/**
 * Render `element` to an HTML string inside the framework provider.
 *
 * @param element - Element to render on the server.
 * @param options - Optional global configuration for the provider.
 * @returns The rendered markup.
 */
export function renderToServerString(
  element: ReactElement,
  options: { config?: ExternalConfig } = {},
): string {
  return renderToString(
    createElement(AsheeUIProvider, {
      config: options.config,
      children: element,
    }),
  );
}

