/**
 * LoadingState component styles for AsheeUI.
 * This file provides the static class mappings for the loading presentation: the
 * region, its panel and the spacing around its parts. The room it claims comes
 * from the shared spacing scale (`SPACE_MIN_HEIGHT_CLASS`).
 */

import type { Size } from "../../shared";

/** The loading region, which centres its indicator and its label. */
export const LOADING_STATE_CLASS =
  "flex w-full min-w-0 flex-col items-center justify-center gap-3 text-center";

/**
 * The panel treatment, for a loading region inside a surface.
 * It carries no padding of its own: the density decides the room, so a panel and
 * a bare region of the same size agree.
 */
export const LOADING_STATE_PANEL_CLASS =
  "rounded-md border border-border bg-background";

/** Vertical padding for each density. */
export const LOADING_STATE_SIZE_CLASS: Record<Size, string> = {
  sm: "py-4",
  md: "py-8",
  lg: "py-12",
};
