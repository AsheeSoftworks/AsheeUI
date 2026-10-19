/**
 * Pagination helpers for AsheeUI.
 * This file provides the pure range calculation the Pagination component is
 * built on, kept apart from the component so the arithmetic can be reasoned
 * about and tested on its own.
 */

/**
 * One entry in a pagination range.
 * An ellipsis stands for the pages a range leaves out.
 */
export type PaginationRangeItem = number | "ellipsis";

/**
 * Calculates the page controls a range shows.
 *
 * The first and last pages are always offered, the current page is always
 * shown with `siblingCount` pages on either side of it, and a gap between two
 * shown pages becomes an ellipsis. A collection short enough to show in full
 * is shown in full.
 *
 * @param page - The current page, counted from one.
 * @param pageCount - How many pages the collection has.
 * @param siblingCount - How many pages to show on each side of the current page.
 * @returns The controls to render, in order.
 */
export function getPaginationRange(
  page: number,
  pageCount: number,
  siblingCount = 1,
): PaginationRangeItem[] {
  if (pageCount <= 0) return [];
  if (pageCount === 1) return [1];

  const current = Math.min(Math.max(page, 1), pageCount);
  const siblings = Math.max(siblingCount, 0);

  const leftSibling = Math.max(current - siblings, 2);
  const rightSibling = Math.min(current + siblings, pageCount - 1);

  const items: PaginationRangeItem[] = [1];

  if (leftSibling > 2) items.push("ellipsis");

  for (let number = leftSibling; number <= rightSibling; number += 1) {
    items.push(number);
  }

  if (rightSibling < pageCount - 1) items.push("ellipsis");

  items.push(pageCount);

  return items;
}
