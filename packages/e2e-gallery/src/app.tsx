/**
 * The playground application every framework entry point renders.
 *
 * It is one component because the playgrounds are one application: the provider
 * and the gallery are the same tree in Next.js, in Vite, in TanStack Start and,
 * when the native package ships its remaining components, in Expo. A framework
 * entry point supplies its routing and image adapters and nothing else, which is
 * what keeps the four playgrounds from drifting into four applications.
 *
 * The provider is mounted here rather than in each host so the configuration is
 * stated once, and it is the empty configuration: the framework's internal
 * defaults are what the playground demonstrates.
 */

"use client";

import {
  AsheeUIProvider,
  Badge,
  Centered,
  HStack,
  Section,
  Typography,
  VStack,
} from "asheeui";
import type { ReactNode } from "react";
import { Gallery } from "./gallery";
import { playgroundConfig } from "./playground-config";
import type { GallerySectionProps } from "./types";

/**
 * Props for the playground application.
 */
export interface PlaygroundAppProps extends GallerySectionProps {
  /**
   * Heading shown above the gallery, which names the framework hosting it.
   *
   * @default "AsheeUI playground"
   */
  title?: string;
}

/**
 * Props for the playground provider.
 */
export interface PlaygroundProviderProps {
  /** The tree the provider wraps. */
  children: ReactNode;
}

/**
 * The configuration boundary, mounted once above everything a playground renders.
 *
 * A shell whose page is more than the gallery (a second route, a link beside it)
 * mounts this at its document root, which is the setup the consumer documentation
 * describes: the provider goes above the page, not inside one screen. The
 * configuration is the empty one, so the framework's internal defaults are what
 * the playground demonstrates.
 *
 * @param props - The provider props.
 * @param props.children - The tree to wrap.
 * @returns The configured tree.
 *
 * @example
 * ```tsx
 * <PlaygroundProvider>
 *   <GalleryIsland />
 *   <AnotherIsland />
 * </PlaygroundProvider>
 * ```
 */
export function PlaygroundProvider({ children }: PlaygroundProviderProps) {
  return (
    <AsheeUIProvider config={playgroundConfig}>{children}</AsheeUIProvider>
  );
}

/**
 * The playground application: the provider and the gallery, in one component.
 *
 * A shell whose page is the application renders this and supplies only its
 * routing and image adapters, which is what keeps the four playgrounds from
 * drifting into four applications.
 *
 * @param props - The application props.
 * @param props.title - Heading for the page.
 * @param props.linkComponent - The host's router link component.
 * @param props.imageComponent - The host's image component.
 * @param props.linkProps - Props for the host's link component.
 * @param props.imageProps - Props for the host's image component.
 * @returns The playground application.
 *
 * @example
 * ```tsx
 * <PlaygroundApp title="AsheeUI on Vite" linkComponent={AppLink} />
 * ```
 */
export function PlaygroundApp({ title, ...substitution }: PlaygroundAppProps) {
  return (
    <PlaygroundProvider>
      {/* The frame the gallery is presented in. It is the framework's own layout and
          text components rather than markup with utility classes, because that is the
          claim the page makes: an application is composed from these components.
          The band carries no heading, because the gallery renders the page's title and
          a second one would give the document two. */}
      <Section spacing="xl">
        <Centered axis="both">
          <VStack gap="md" align="center" className="max-w-3xl text-center">
            <Badge color="primary" variant="faded">
              Playground
            </Badge>
            <Typography role="body-lg" tone="muted">
              Every component the documentation claims, in every state it claims, in an
              application composed from AsheeUI components and nothing else. A prop that
              does not exist, a colour role that does not resolve or a layout that only
              works in one direction is meant to fail here, before a consumer meets it.
            </Typography>
            <HStack gap="sm" justify="center" wrap>
              <Badge color="secondary">Mobile</Badge>
              <Badge color="secondary">Web</Badge>
              <Badge color="secondary">Desktop</Badge>
            </HStack>
          </VStack>
        </Centered>
      </Section>
      <Gallery title={title} {...substitution} />
    </PlaygroundProvider>
  );
}
