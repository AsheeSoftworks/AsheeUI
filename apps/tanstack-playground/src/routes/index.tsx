import { PlaygroundApp } from "@asheeui/e2e-gallery";
import { createFileRoute, Link } from "@tanstack/react-router";

/**
 * The gallery route, which is the application's home page.
 *
 * TanStack Router's own `Link` is substituted into every component that renders a
 * link, with a marker on each so the end-to-end test can prove the substitution
 * reached the markup. Everything else on the page, including the provider and the
 * empty configuration, comes from the shared playground application.
 */
export const Route = createFileRoute("/")({ component: GalleryRoute });

/**
 * @returns The gallery, wired to the router's link.
 */
function GalleryRoute() {
  return (
    <PlaygroundApp
      title="AsheeUI on TanStack Start"
      linkComponent={Link}
      linkProps={{ "data-tanstack-link": "true" }}
    />
  );
}
