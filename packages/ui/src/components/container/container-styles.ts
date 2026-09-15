/**
 * Container component styles for AsheeUI.
 * This file provides the static class mappings for the Container layout
 * primitive: maximum widths and the shared base classes.
 */

import { SPACE_PADDING_X_CLASS } from "../../shared";
import type { ContainerSize } from "./container-config";

/**
 * Maximum width class for each container size.
 * The classes are complete literals so Tailwind can see them.
 */
export const CONTAINER_MAX_WIDTH_CLASS: Record<ContainerSize, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

/**
 * Shared base classes for every container.
 * The container is a block element that never exceeds its parent.
 */
export const CONTAINER_BASE_CLASS = "w-full";

/**
 * Horizontal gutter applied when the gutter is enabled.
 * The scale token is the layout gutter of the framework, so a container and a
 * section align on the same edge.
 */
export const CONTAINER_GUTTER_CLASS = SPACE_PADDING_X_CLASS.lg;
