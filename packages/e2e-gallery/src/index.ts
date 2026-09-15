/**
 * The playground package's application surface.
 *
 * A playground imports this module for everything it renders: the application, the
 * configuration boundary, the gallery and the contract its sections satisfy. It
 * deliberately exports nothing that reaches for a test environment, so an
 * application bundle carries the playground and not the way it is verified; a
 * playground's end-to-end test imports `@asheeui/e2e-gallery/testing` instead, and
 * the browser stand-ins it needs are at `@asheeui/e2e-gallery/setup`.
 */

export {
  PlaygroundApp,
  type PlaygroundAppProps,
  PlaygroundProvider,
  type PlaygroundProviderProps,
} from "./app";
export { Gallery, type GalleryProps } from "./gallery";
export { playgroundConfig } from "./playground-config";
export { GALLERY_SECTIONS } from "./sections";
export type { GallerySection, GallerySectionProps } from "./types";
