/**
 * The gallery component a playground renders.
 *
 * It frames every section in a labelled landmark and forwards the playground's
 * link and image components, so the only framework-specific markup in a
 * playground is the entry point that mounts this component.
 */

import { Typography } from "asheeui";
import { GALLERY_SECTIONS } from "./sections";
import type { GallerySectionProps } from "./types";

/** Props for the gallery. */
export interface GalleryProps extends GallerySectionProps {
  /**
   * Heading shown above the gallery.
   * @default "AsheeUI playground"
   */
  title?: string;
}

/**
 * Renders every gallery section.
 *
 * @param props - The gallery props.
 * @param props.title - Heading for the page.
 * @param props.linkComponent - Framework link component to substitute.
 * @param props.imageComponent - Framework image component to substitute.
 * @returns The gallery.
 */
export function Gallery({
  title = "AsheeUI playground",
  linkComponent,
  imageComponent,
  linkProps,
  imageProps,
}: GalleryProps) {
  return (
    <main data-gallery className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <header className="space-y-2">
        <Typography as="h1" role="heading-lg">
          {title}
        </Typography>
        <Typography role="body-md">
          Every section below is rendered by this playground and checked by its
          end-to-end test, on the server and again after hydration.
        </Typography>
      </header>

      {GALLERY_SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          data-gallery-section={section.id}
          aria-label={section.title}
          className="space-y-3">
          <Typography as="h2" role="body-md">
            {section.title}
          </Typography>
          <section.Component
            linkComponent={linkComponent}
            imageComponent={imageComponent}
            linkProps={linkProps}
            imageProps={imageProps}
          />
        </section>
      ))}
    </main>
  );
}
