/**
 * The Vite playground's end-to-end test.
 *
 * It renders the application through the playground's own server-rendering
 * entry, checks the gallery contract against that markup, hydrates the same tree
 * the browser hydrates, and then performs the interactions a consumer performs.
 * The three steps together are what "the library works on Vite" means.
 */

import { describe, expect, it } from "vitest";
import { App } from "./app";
import { renderServer } from "./entry-server";
import {
  hydrateMarkup,
  inspectGallery,
  parseMarkup,
  runGalleryInteractions,
} from "./playground";

describe("Vite playground", () => {
  it("server-renders the gallery through its SSR entry", () => {
    const root = parseMarkup(renderServer());

    expect(inspectGallery(root)).toEqual([]);
  });

  it("substitutes the consumer's link into every component that renders one", () => {
    const root = parseMarkup(renderServer());

    // The local `AppLink` marks its anchors, so a plain anchor from the library
    // would fail these checks.
    expect(
      root.querySelectorAll('a[data-vite-link="true"]').length,
    ).toBeGreaterThan(0);

    const linkSection = root.querySelector('[data-gallery-section="links"] a');

    expect(linkSection?.getAttribute("data-vite-link")).toBe("true");
    expect(linkSection?.getAttribute("href")).toBe("/invoices");
  });

  it("hydrates the server markup and keeps every contract", () => {
    const result = hydrateMarkup(renderServer(), <App />);

    try {
      expect(result.errors).toEqual([]);
      expect(inspectGallery(result.container)).toEqual([]);
    } finally {
      result.unmount();
    }
  });

  it("performs the interactions a consumer performs", async () => {
    const result = hydrateMarkup(renderServer(), <App />);

    try {
      expect(await runGalleryInteractions(result.container)).toEqual([]);
    } finally {
      result.unmount();
    }
  });
});
