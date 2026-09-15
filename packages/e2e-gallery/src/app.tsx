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

import { AsheeUIProvider } from "asheeui";
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
      <Gallery title={title} {...substitution} />
    </PlaygroundProvider>
  );
}
