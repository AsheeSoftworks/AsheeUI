/**
 * Drawer component styles for AsheeUI.
 * This file provides CSS class mappings for the Drawer component's
 * size, placement, border, and animation options.
 */

import type { DrawerPlacement, DrawerSize } from "./drawer-config";

/**
 * CSS classes for drawer width based on size.
 * Used for left and right placed drawers.
 */
export const DRAWER_WIDTH_CLASS: Record<DrawerSize, string> = {
  sm: "w-80",
  md: "w-[28rem]",
  lg: "w-[36rem]",
  full: "w-screen",
};

/**
 * CSS classes for drawer height based on size.
 * Used for top and bottom placed drawers.
 */
export const DRAWER_HEIGHT_CLASS: Record<DrawerSize, string> = {
  sm: "h-80",
  md: "h-[28rem]",
  lg: "h-[36rem]",
  full: "h-screen",
};

/**
 * CSS classes for drawer container positioning.
 * Controls the flex alignment of the container based on placement.
 */
export const DRAWER_CONTAINER_PLACEMENT_CLASS: Record<DrawerPlacement, string> =
  {
    right: "justify-end items-stretch",
    left: "justify-start items-stretch",
    top: "flex-col justify-start items-stretch",
    bottom: "flex-col justify-end items-stretch",
  };

/**
 * CSS classes for drawer border placement.
 * Adds a border on the side where the drawer opens from.
 */
export const DRAWER_BORDER_PLACEMENT_CLASS: Record<DrawerPlacement, string> = {
  right: "border-l",
  left: "border-r",
  top: "border-b",
  bottom: "border-t",
};

/**
 * CSS classes for drawer slide animations.
 * Each placement has its own open and closed animation states.
 * These classes should be defined in your global CSS with keyframe animations.
 */
export const DRAWER_ANIMATION_STATE: Record<
  DrawerPlacement,
  { closed: string; open: string }
> = {
  right: {
    closed: "drawer-slide-right-closed",
    open: "drawer-slide-right-open",
  },
  left: {
    closed: "drawer-slide-left-closed",
    open: "drawer-slide-left-open",
  },
  top: {
    closed: "drawer-slide-top-closed",
    open: "drawer-slide-top-open",
  },
  bottom: {
    closed: "drawer-slide-bottom-closed",
    open: "drawer-slide-bottom-open",
  },
};
