/**
 * Modal component styles for AsheeUI.
 * This file provides CSS class mappings for the Modal component's
 * size and position options.
 */

import type { ModalPosition, ModalSizeKey } from "./modal-config";

/**
 * CSS classes for modal maximum width based on size.
 * Controls the width constraint of the modal content.
 */
export const MODAL_MAX_WIDTH_CLASS: Record<ModalSizeKey, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)]",
};

/**
 * CSS classes for modal position.
 * Controls the vertical alignment of the modal.
 */
export const MODAL_POSITION_CLASS: Record<ModalPosition, string> = {
  center: "",
  top: "self-start mt-12",
  bottom: "self-end mb-12",
};
