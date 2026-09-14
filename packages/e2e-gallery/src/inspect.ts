/**
 * Runs the gallery's contract against a rendered tree.
 *
 * The same function is used on the markup a framework produced on the server and
 * on the same tree after hydration, so the two are compared through one set of
 * expectations rather than two.
 */

import { GALLERY_SECTIONS } from "./sections";

/**
 * Checks every gallery section.
 *
 * @param root - A document, a container, or the parsed server markup.
 * @returns One description per problem; empty when the gallery is correct.
 */
export function inspectGallery(root: ParentNode): string[] {
  return GALLERY_SECTIONS.flatMap((section) => section.inspect(root));
}

/**
 * Reads the identifiers of every gallery section.
 *
 * @returns The section identifiers, in render order.
 */
export function gallerySectionIds(): string[] {
  return GALLERY_SECTIONS.map((section) => section.id);
}
