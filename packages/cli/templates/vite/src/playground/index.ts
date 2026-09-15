/**
 * The playground package's application surface.
 *
 * A playground imports this module for everything it renders: the application, the
 * configuration boundary, the gallery and the contract its sections satisfy. It
 * deliberately exports nothing that renders, hydrates or inspects a test tree, so
 * an application bundle carries the playground rather than the way it is verified:
 * those modules are the verification surface, which a playground's end-to-end test
 * imports instead. The browser stand-ins a test installs first are a third surface
 * beside it. A section states its own contract, so the contract helpers travel with
 * the sections rather than with the verification surface.
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
