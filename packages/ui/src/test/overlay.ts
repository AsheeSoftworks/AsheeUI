/**
 * Portal and overlay helper (`TEST-023`, `TEST-028`).
 *
 * Overlay content is rendered outside the component subtree, so these helpers
 * make the portal relationship explicit instead of relying on document-wide
 * queries.
 */

import { screen } from "@testing-library/react";
import { expect } from "vitest";

/**
 * `queryByRole` argument tuple, derived from the testing library.
 */
type QueryByRoleArgs = Parameters<typeof screen.queryByRole>;

/**
 * Assert that `element` is rendered outside `container` but inside the
 * document body, which is the observable result of portal rendering.
 *
 * @param element - Portal-rendered element.
 * @param container - The component subtree it must not belong to.
 */
export function expectPortalled(
  element: HTMLElement,
  container: HTMLElement,
): void {
  expect(container.contains(element)).toBe(false);
  expect(document.body.contains(element)).toBe(true);
}

/**
 * Assert that `element` renders inside the component subtree, which is the
 * observable result of not using a portal.
 *
 * @param element - Element that must belong to the subtree.
 * @param container - The component subtree.
 */
export function expectNotPortalled(
  element: HTMLElement,
  container: HTMLElement,
): void {
  expect(container.contains(element)).toBe(true);
}

/**
 * Query overlay content by accessible role anywhere in the document.
 *
 * @param role - Accessible role (or an options object).
 * @returns The matched element, or `null` when the overlay is absent.
 */
export function queryOverlay(...role: QueryByRoleArgs): HTMLElement | null {
  return screen.queryByRole(...role);
}
