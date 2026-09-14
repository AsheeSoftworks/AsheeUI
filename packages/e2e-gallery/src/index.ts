/**
 * The end-to-end gallery shared by the playground applications.
 *
 * A playground imports {@link Gallery}, renders it inside its own framework, and
 * then asserts the contract published here against its server markup and its
 * hydrated tree. See `packages/e2e-gallery/README.md` for how a playground is
 * wired and what it has to prove.
 */

export {
  accessibleNameOf,
  createReport,
  createSectionReport,
  requireAbsent,
  requireAnyText,
  requireAttribute,
  requireAttributes,
  requireElement,
  requireName,
  requireOwnText,
  requireText,
  textOf,
} from "./dom";
export { click, focus, press, settle, waitFor } from "./events";
export { Gallery, type GalleryProps } from "./gallery";
export { hydrateMarkup, parseMarkup, renderServerMarkup, type HydrationResult } from "./harness";
export { gallerySectionIds, inspectGallery } from "./inspect";
export { GALLERY_INTERACTIONS, runGalleryInteractions } from "./interactions";
export { GALLERY_SECTIONS } from "./sections";
export type {
  GalleryInteraction,
  GallerySection,
  GallerySectionProps,
  Report,
} from "./types";
