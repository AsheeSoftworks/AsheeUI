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

import { act } from "@testing-library/react";
import { createElement, type ReactElement } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
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

/** The outcome of server-rendering a tree and hydrating it. */
export interface HydrationResult {
  /** Element holding the server markup and then the hydrated tree. */
  container: HTMLElement;
  /** Everything React reported while hydrating, in order. */
  errors: unknown[];
  /** Unmount the hydrated tree and remove its container. */
  unmount: () => void;
}

/**
 * Server-render `element`, hydrate that markup, and collect what React
 * reported.
 *
 * This is the check a framework that server-renders its client components
 * needs: the first client render must produce the markup the server sent, or
 * the framework reports a hydration mismatch and repaints the tree. The tree is
 * hydrated exactly as the server rendered it, inside the framework provider and
 * with the same configuration.
 *
 * @param element - Element to render on the server and hydrate.
 * @param options - Optional global configuration for the provider.
 * @returns The container, everything React reported, and an unmount hook.
 */
export function renderHydrated(
  element: ReactElement,
  options: { config?: ExternalConfig } = {},
): HydrationResult {
  const container = document.createElement("div");
  container.innerHTML = renderToServerString(element, options);
  document.body.appendChild(container);

  const errors: unknown[] = [];
  const consoleError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args);
  };

  let root: Root | undefined;

  try {
    act(() => {
      root = hydrateRoot(
        container,
        createElement(AsheeUIProvider, {
          config: options.config,
          children: element,
        }),
        {
          onRecoverableError: (error: unknown) => {
            errors.push(error);
          },
        },
      );
    });
  } finally {
    console.error = consoleError;
  }

  return {
    container,
    errors,
    unmount: () => {
      act(() => {
        root?.unmount();
      });
      container.remove();
    },
  };
}

/**
 * Assert that hydrating the server markup of `element` reports nothing.
 *
 * A component that renders differently on the client than on the server fails
 * here rather than in a consumer's browser console.
 *
 * @param element - Element to render on the server and hydrate.
 * @param options - Optional global configuration for the provider.
 */
export function expectHydrationClean(
  element: ReactElement,
  options: { config?: ExternalConfig } = {},
): void {
  const result = renderHydrated(element, options);

  try {
    if (result.errors.length > 0) {
      throw new Error(
        `Hydration reported ${result.errors.length} problem(s): ${result.errors
          .map((error) => String(error))
          .join(" | ")}`,
      );
    }
  } finally {
    result.unmount();
  }
}


