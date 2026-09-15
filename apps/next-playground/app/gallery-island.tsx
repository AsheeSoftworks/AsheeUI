"use client";

import { PlaygroundApp } from "@asheeui/e2e-gallery";
import NextImage from "next/image";
import NextLink from "next/link";

/**
 * The gallery as a client component, which is what an AsheeUI component is in
 * an App Router application.
 *
 * Being a client component does not stop it from being server-rendered: Next.js
 * renders this on the server first and hydrates it in the browser, and the
 * playground's end-to-end test asserts both. The framework's own `Link` and
 * `Image` are substituted, with a marker on each so the test can prove the
 * substitution reached the markup.
 *
 * @returns The gallery, wired to the framework's routing and image components.
 */
export function GalleryIsland() {
  return (
    <PlaygroundApp
      title="AsheeUI on Next.js"
      linkComponent={NextLink}
      linkProps={{ "data-next-link": "true" }}
      imageComponent={NextImage}
      imageProps={{ "data-next-image": "true", width: 40, height: 40 }}
    />
  );
}
