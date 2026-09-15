/**
 * The verification surface of the playground package.
 *
 * A playground's end-to-end test imports from here, and an application must not:
 * this module reaches for a browser environment, a test renderer and the testing
 * library, so it belongs to the test a playground runs rather than to the
 * playground the consumer ships. Keeping the two surfaces apart is what keeps the
 * modules that render, hydrate and inspect a tree out of an application bundle.
 *
 * The browser stand-ins a test installs before any of this runs are the third
 * surface, beside this one.
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
export { click, focus, press, settle, typeInto, waitFor } from "./events";
export {
  type HydrationResult,
  hydrateMarkup,
  parseMarkup,
  renderServerMarkup,
} from "./harness";
export { gallerySectionIds, inspectGallery } from "./inspect";
export { GALLERY_INTERACTIONS, runGalleryInteractions } from "./interactions";
export type { GalleryInteraction, Report } from "./types";
