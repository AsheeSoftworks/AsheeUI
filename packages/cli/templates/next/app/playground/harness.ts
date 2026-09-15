/**
 * The rendering harness every playground's end-to-end test uses.
 *
 * A playground supplies its own tree, because the tree is the framework: a Vite
 * entry, a Next.js page or a TanStack Router provider. The harness supplies what
 * the three have in common: rendering that tree to markup, parsing markup for
 * inspection, and hydrating it while collecting everything React reports.
 *
 * Hydration errors are collected rather than asserted here, so a test can report
 * them next to the contract problems it found in the same run.
 */

import { act } from "@testing-library/react";
import type { ReactElement } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";

/** The outcome of hydrating a playground's server markup. */
export interface HydrationResult {
  /** Element holding the server markup and then the hydrated tree. */
  container: HTMLElement;

  /** Everything React reported while hydrating, in order. */
  errors: string[];

  /** Unmount the hydrated tree and remove its container. */
  unmount: () => void;
}

/**
 * Renders a playground's tree to markup, the way its framework does on the
 * server.
 *
 * @param tree - The playground's tree.
 * @returns The server markup.
 */
export function renderServerMarkup(tree: ReactElement): string {
  return renderToString(tree);
}

/**
 * Parses server markup into a container so the contract can be checked against
 * the markup itself.
 *
 * Parsing does not run scripts, so a theme script in the markup is inert here,
 * exactly as it is before a browser executes it.
 *
 * @param html - Server markup.
 * @returns A container holding the parsed markup.
 */
export function parseMarkup(html: string): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container;
}

/**
 * Hydrates a playground's server markup with the same tree that produced it.
 *
 * @param html - The server markup.
 * @param tree - The tree that produced the markup.
 * @returns The container, what React reported, and an unmount hook.
 */
export function hydrateMarkup(
  html: string,
  tree: ReactElement,
): HydrationResult {
  const container = parseMarkup(html);
  document.body.appendChild(container);

  const errors: string[] = [];
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args.map((value) => String(value)).join(" "));
  };

  let root: Root | undefined;

  try {
    act(() => {
      root = hydrateRoot(container, tree, {
        onRecoverableError: (error: unknown) => {
          errors.push(String(error));
        },
      });
    });
  } finally {
    console.error = originalError;
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
