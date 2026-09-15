/**
 * The verification surface of the playground package.
 *
 * A playground's end-to-end test imports from here, and an application must not:
 * this module reaches for a browser environment and for the testing library, so it
 * belongs to the test a playground runs rather than to the playground the consumer
 * ships. Keeping the two surfaces apart is what lets an application import
 * `@asheeui/e2e-gallery` and bundle nothing of this.
 *
 * `@asheeui/e2e-gallery/setup` is the third surface: the browser stand-ins the
 * playground tests install before any of this runs.
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
