/**
 * The LoadingState's class dictionaries, for both renderers.
 *
 * The loading region is the same arrangement on both platforms — an indicator above
 * what it is loading — and the densities step together, so a region reads as the
 * same weight of wait on either one. What differs is the units: the web writes a
 * vertical padding and the platform the same step in its own scale, which is why the
 * maps are separate even though the keys are shared.
 *
 * The room the state claims is not here: it comes from the shared spacing scale
 * (`SPACE_MIN_HEIGHT_CLASS`), so a loading region claims the same room on a wide
 * screen and on a phone.
 */

import type { Size } from "../../shared/radius";

/** The loading region, which centres its indicator and its label, on the web. */
export const LOADING_STATE_CLASS =
  "flex w-full min-w-0 flex-col items-center justify-center gap-3 text-center";

/**
 * The web panel treatment, for a loading region inside a surface.
 * It carries no padding of its own: the density decides the room, so a panel and a
 * bare region of the same size agree.
 */
export const LOADING_STATE_PANEL_CLASS =
  "rounded-md border border-border bg-background";

/** Vertical padding for each density, on the web. */
export const LOADING_STATE_SIZE_CLASS: Record<Size, string> = {
  sm: "py-4",
  md: "py-8",
  lg: "py-12",
};

// ─── Native ───────────────────────────────────────────────────────────────────

/** The loading region, which centres its indicator and its label, on the platform. */
export const NATIVE_LOADING_STATE_CLASS =
  "w-full flex-col items-center justify-center gap-3";

/**
 * The native panel treatment.
 * The corners come from the shared radius vocabulary rather than from this string,
 * so a panel here rounds the way every other native surface does.
 */
export const NATIVE_LOADING_STATE_PANEL_CLASS =
  "w-full border border-border bg-background";

/** Vertical padding for each density, on the platform. */
export const NATIVE_LOADING_STATE_SIZE_CLASS: Record<Size, string> = {
  sm: "py-4",
  md: "py-8",
  lg: "py-12",
};
