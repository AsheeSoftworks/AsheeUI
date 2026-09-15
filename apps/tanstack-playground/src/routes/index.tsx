import { Gallery } from "@asheeui/e2e-gallery";
import { createFileRoute, Link } from "@tanstack/react-router";

/**
 * The gallery route, which is the application's home page.
 *
 * TanStack Router's own `Link` is substituted into every component that renders a
 * link, with a marker on each so the end-to-end test can prove the substitution
 * reached the markup.
 */
export const Route = createFileRoute("/")({ component: GalleryRoute });

/**
 * @returns The gallery, wired to the router's link.
 */
function GalleryRoute() {
  return (
    <Gallery
      title="AsheeUI on TanStack Start"
      linkComponent={Link}
      linkProps={{ "data-tanstack-link": "true" }}
    />
  );
}
