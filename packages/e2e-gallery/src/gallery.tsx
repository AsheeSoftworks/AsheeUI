/**
 * The gallery that every playground application renders.
 *
 * The contract that markup must satisfy, the interactions a consumer performs and
 * the harness that renders and hydrates a tree are deliberately not here: they
 * belong to the verification surface, which a playground's test imports from
 * `@asheeui/e2e-gallery/testing`. An application renders the gallery, and reaching
 * the test harness from an application would pull a browser and a test renderer
 * into the application's graph.
 */

"use client";

import { Container, Section, Typography, VStack } from "asheeui";
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
    <Container as="main" data-gallery size="md">
      <VStack gap="xl">
        <VStack gap="sm">
          <Typography as="h1" role="heading-lg">
            {title}
          </Typography>
          <Typography role="body-md">
            Every section below is rendered by this playground and checked by
            its end-to-end test, on the server and again after hydration.
          </Typography>
        </VStack>

        {GALLERY_SECTIONS.map((section) => (
          <Section
            key={section.id}
            id={section.id}
            data-gallery-section={section.id}
            aria-label={section.title}
            spacing="none">
            <VStack gap="md">
              <Typography as="h2" role="body-md">
                {section.title}
              </Typography>
              <section.Component
                linkComponent={linkComponent}
                imageComponent={imageComponent}
                linkProps={linkProps}
                imageProps={imageProps}
              />
            </VStack>
          </Section>
        ))}
      </VStack>
    </Container>
  );
}
