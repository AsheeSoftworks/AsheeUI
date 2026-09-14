/**
 * Breadcrumb component styles for AsheeUI.
 * This file provides CSS class mappings for the Breadcrumb component's text
 * and spacing scale, plus the classes its structure is built from.
 */

import type { Size } from "../../shared";

/**
 * CSS classes for the trail's text size based on size.
 */
export const BREADCRUMB_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * CSS classes for the gap between trail items based on size.
 */
export const BREADCRUMB_GAP_CLASS: Record<Size, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

/**
 * CSS classes for the separator's icon size based on size.
 */
export const BREADCRUMB_SEPARATOR_ICON_CLASS: Record<Size, string> = {
  sm: "[&_svg]:size-3",
  md: "[&_svg]:size-3.5",
  lg: "[&_svg]:size-4",
};

/**
 * Base classes for the navigation landmark.
 */
export const BREADCRUMB_BASE_CLASS = "w-full";

/**
 * Classes for the ordered list that holds the trail.
 */
export const BREADCRUMB_LIST_CLASS =
  "flex items-center flex-wrap list-none p-0 m-0";

/**
 * Classes for the current location.
 * It is presented in the foreground colour so it reads as the end of the
 * trail rather than as another link.
 */
export const BREADCRUMB_CURRENT_CLASS =
  "inline-flex items-center gap-1.5 min-w-0 truncate font-medium text-foreground";
