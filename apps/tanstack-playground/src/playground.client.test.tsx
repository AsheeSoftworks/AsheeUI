/**
 * The TanStack Start playground's browser test.
 *
 * The server half of this playground is `playground.ssr.test.tsx`, which serves
 * the route through the framework's renderer in a browserless environment. This
 * file mounts the same route tree in a browser environment and drives it, which
 * is where the gallery's interactions live: a router that only renders is not a
 * router that works.
 *
 * The root route renders the document, so mounting it in a container element
 * produces the nesting warning React emits for a document below an element. The
 * framework mounts at the document level; the container is the test's compromise,
 * because the DOM a test owns is not the DOM of a page.
 */

import { RouterProvider, createMemoryHistory } from "@tanstack/react-router";
import { inspectGallery, runGalleryInteractions } from "@asheeui/e2e-gallery";
import { act } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { getRouter } from "./router";

/** Routes take longer than a component render, because the router loads them. */
const ROUTE_TIMEOUT = 20000;

/**
 * Mounts the application's route tree in the browser environment.
 *
 * @param path - Route to mount.
 * @returns The mounted container and an unmount hook.
 */
async function mountApp(path = "/") {
  const router = getRouter({
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  await router.load();

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(<RouterProvider router={router} />);
  });

  return {
    container,
    unmount: async () => {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe("TanStack Start playground, browser", () => {
  it(
    "renders the gallery route and keeps every contract",
    async () => {
      const app = await mountApp();

      try {
        expect(inspectGallery(app.container)).toEqual([]);
      } finally {
        await app.unmount();
      }
    },
    ROUTE_TIMEOUT,
  );

  it(
    "performs the interactions a consumer performs",
    async () => {
      const app = await mountApp();

      try {
        expect(await runGalleryInteractions(app.container)).toEqual([]);
      } finally {
        await app.unmount();
      }
    },
    ROUTE_TIMEOUT,
  );
});
