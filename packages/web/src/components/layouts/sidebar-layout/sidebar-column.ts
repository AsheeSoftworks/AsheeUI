/**
 * The sidebar-column context for AsheeUI.
 *
 * `SidebarLayout` gives its navigation column the complementary landmark: the
 * column is an `aside` named by `sidebarLabel`. The framework's `Sidebar` is an
 * `aside` too, because a sidebar on its own is a region of a page. Composed, the
 * two would nest one complementary landmark inside another and a landmark list
 * would offer the same region twice.
 *
 * This context is how the column tells a `Sidebar` that the landmark already
 * exists: the layout provides it around the slot, and a `Sidebar` inside reads it
 * and renders a plain `div` instead of its own `aside`, leaving its `nav` — the
 * navigation landmark a reader actually jumps to — as what it contributes.
 *
 * The default is `false`, so a `Sidebar` rendered on its own keeps its own
 * complementary landmark.
 */

"use client";

import { createContext, useContext } from "react";

/**
 * Whether the current subtree already sits inside a `SidebarLayout` navigation
 * column, which is a complementary landmark of its own.
 */
export const SidebarColumnContext = createContext(false);

/**
 * Read whether a component is rendered inside a `SidebarLayout` navigation
 * column.
 *
 * @returns `true` when an ancestor column already provides the complementary
 * landmark.
 */
export function useWithinSidebarColumn(): boolean {
  return useContext(SidebarColumnContext);
}
