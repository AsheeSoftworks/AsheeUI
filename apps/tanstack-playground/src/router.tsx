import { createRouter, type RouterHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/**
 * Creates the application's router.
 *
 * The application calls it with no arguments and gets the browser history. The
 * end-to-end test calls it with a memory history, which is how the same route
 * tree is rendered on the server and then hydrated.
 *
 * @param options - Optional router options.
 * @param options.history - History to drive the router with.
 * @returns The router.
 */
export function getRouter(options: { history?: RouterHistory } = {}) {
  return createRouter({
    routeTree,
    history: options.history,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
