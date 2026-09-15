/**
 * FileUpload component styles for AsheeUI.
 * This file provides the static class mappings for the file field: the drop
 * zone, the drop state, the control's label, the hint and the list of chosen
 * files.
 */

import type { Size } from "../../shared";

/**
 * The drop zone, which is a label for the field it hides.
 * Its focus ring follows the field, so the zone shows where the keyboard is even
 * though the field itself is visually hidden.
 */
export const FILE_UPLOAD_ZONE_CLASS =
  "flex w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-background text-center transition-colors hover:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2";

/** The zone while a file is dragged over it. */
export const FILE_UPLOAD_ZONE_ACTIVE_CLASS = "border-primary bg-primary/10";

/** The zone when the field is unavailable. */
export const FILE_UPLOAD_ZONE_DISABLED_CLASS =
  "cursor-not-allowed opacity-60 hover:border-border";

/** Padding for each density. */
export const FILE_UPLOAD_SIZE_CLASS: Record<Size, string> = {
  sm: "px-4 py-6",
  md: "px-6 py-10",
  lg: "px-8 py-14",
};

/** The control's label, styled as an emphasised part of the zone. */
export const FILE_UPLOAD_BUTTON_CLASS = "font-medium text-primary underline";

/** The instruction beside it. */
export const FILE_UPLOAD_HINT_CLASS = "text-sm text-foreground/60";

/** The field itself, which is present for the keyboard and the picker only. */
export const FILE_UPLOAD_INPUT_CLASS = "sr-only";

/** The list of chosen files. */
export const FILE_UPLOAD_LIST_CLASS = "flex flex-wrap gap-2 pt-1";
