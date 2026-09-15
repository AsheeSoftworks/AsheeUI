/**
 * EmptyState component styles for AsheeUI.
 * This file provides the static class mappings for the EmptyState pattern.
 */

import type { Size } from "../../shared";
import type { EmptyStateType } from "./empty-state-config";

/** Inner arrangement of the state. */
export const EMPTY_STATE_CLASS = "flex flex-col items-center gap-4 text-center";

/** Padding of the state at each density. */
export const EMPTY_STATE_SIZE_CLASS: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-10",
};

/** The panel treatment. */
export const EMPTY_STATE_PANEL_CLASS =
  "rounded-md border border-border bg-background";

/** Spacing between the icon badge and the text at each density. */
export const EMPTY_STATE_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

/** Badge that holds the state's icon, coloured by tone. */
export const EMPTY_STATE_ICON_CLASS: Record<EmptyStateType, string> = {
  info: "flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary",
  success:
    "flex shrink-0 items-center justify-center rounded-full bg-success/10 text-success",
  warning:
    "flex shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning",
  error:
    "flex shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger",
};
