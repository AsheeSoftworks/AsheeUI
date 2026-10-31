/**
 * The router instance.
 *
 * The route files under `src/routes` are the application's pages, and `tsr generate`
 * (run by `dev`, `build` and `typecheck`) writes the tree they compile to. TanStack Start
 * reads the `getRouter` export.
 */
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
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
