// @vitest-environment node
/**
 * The TanStack Start playground's server-rendering test.
 *
 * It runs with no DOM globals at all, because that is the environment a
 * full-stack framework serves from. The route is served by rendering the
 * framework's own `RouterProvider` for a router built with a memory history, in
 * the same way the framework's request handler does before it streams a
 * response. The served document is then parsed with jsdom so the shared gallery
 * contract can be checked against the real markup.
 *
 * The browser half of this playground lives in `playground.client.test.tsx`.
 */

import { inspectGallery } from "@asheeui/e2e-gallery";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { JSDOM } from "jsdom";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getRouter } from "./router";

/**
 * Serves a path through the framework's router.
 *
 * @param path - Route to serve.
 * @returns The served markup.
 */
async function serveRoute(path = "/"): Promise<string> {
  const router = getRouter({
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  await router.load();

  return renderToString(<RouterProvider router={router} />);
}

/**
 * Parses a served document so the contract can run against it.
 *
 * @param html - The served document.
 * @returns The parsed document.
 */
function parseServedDocument(html: string): Document {
  return new JSDOM(html).window.document;
}

describe("TanStack Start playground, server rendering", () => {
  it("runs without DOM globals, so the serving below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("serves the gallery route through the framework's router", async () => {
    const served = await serveRoute();

    expect(served).toContain("data-gallery");
    expect(inspectGallery(parseServedDocument(served))).toEqual([]);
  }, 20000);

  it("substitutes the router's own link into the served markup", async () => {
    const document = parseServedDocument(await serveRoute());

    expect(
      document.querySelectorAll('a[data-tanstack-link="true"]').length,
    ).toBeGreaterThan(0);
  }, 20000);
});
