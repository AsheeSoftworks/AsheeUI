/**
 * The Next.js playground's end-to-end test.
 *
 * Next.js owns the build, so this test covers three surfaces: the client island
 * rendered the way Next.js renders it on the server, the same markup hydrated
 * the way the browser hydrates it, and the pages Next.js itself prerendered
 * during the build. The last one is why the test script builds first, because
 * the point of this playground is the framework's own output, including its
 * router link and its image component.
 */

import { readFileSync } from "node:fs";
import { PlaygroundProvider } from "../app/playground";
import {
  hydrateMarkup,
  inspectGallery,
  parseMarkup,
  renderServerMarkup,
  runGalleryInteractions,
} from "../app/playground/testing";
import { describe, expect, it } from "vitest";
import { GalleryIsland } from "../app/gallery-island";
import { SubstitutionLink } from "../app/substitution-link";

/** The page Next.js prerenders, and the substitution page beside it. */
const PRERENDERED_PAGE = ".next/server/app/index.html";
const PRERENDERED_SUBSTITUTION = ".next/server/app/substitution.html";

/**
 * The tree the application renders.
 *
 * It mirrors the application exactly: the root layout mounts the provider, and the
 * page renders its client islands inside it. Keeping the two in step is what makes
 * the hydration check meaningful.
 *
 * @returns The application tree.
 */
function appTree() {
  return (
    <PlaygroundProvider>
      <GalleryIsland />
      <SubstitutionLink />
    </PlaygroundProvider>
  );
}

describe("Next.js playground", () => {
  it("server-renders the gallery island", () => {
    const root = parseMarkup(renderServerMarkup(appTree()));

    expect(inspectGallery(root)).toEqual([]);
  });

  it("prerenders the page, server component and client island together", () => {
    const html = readFileSync(PRERENDERED_PAGE, "utf8");

    expect(inspectGallery(parseMarkup(html))).toEqual([]);

    // The island substitutes Next.js's own link, and the marker proves it.
    expect(html).toContain('data-next-link="true"');
  });

  it("prerenders the substitution page through next/link and next/image", () => {
    const root = parseMarkup(readFileSync(PRERENDERED_SUBSTITUTION, "utf8"));

    expect(
      root.querySelector('a[data-next-link="true"]')?.getAttribute("href"),
    ).toBe("/");
    expect(root.querySelector('img[data-next-image="true"]')).not.toBeNull();
  });

  it("hydrates the island markup and keeps every contract", () => {
    const result = hydrateMarkup(renderServerMarkup(appTree()), appTree());

    try {
      expect(result.errors).toEqual([]);
      expect(inspectGallery(result.container)).toEqual([]);
    } finally {
      result.unmount();
    }
  });

  it("performs the interactions a consumer performs", async () => {
    const result = hydrateMarkup(renderServerMarkup(appTree()), appTree());

    try {
      expect(await runGalleryInteractions(result.container)).toEqual([]);
    } finally {
      result.unmount();
    }
  });
});
