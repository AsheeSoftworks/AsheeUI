/**
 * Centered component styles for AsheeUI.
 * This file provides the static class mappings for the Centered layout
 * primitive: the centring axis. The vertical room a centred block claims comes
 * from the shared spacing scale (`SPACE_MIN_HEIGHT_CLASS`), so the block and the
 * loading state that also claims height agree on what a step means.
 */

import type { CenteredAxis } from "./centered-config";

/**
 * Centring classes for each axis.
 * `both` also centres the text, because a block that is centred on both axes is
 * almost always a short statement; a consumer with a different intent appends
 * its own class, which wins.
 */
export const CENTERED_AXIS_CLASS: Record<CenteredAxis, string> = {
  both: "items-center justify-center text-center",
  horizontal: "items-center",
  vertical: "justify-center",
};

/** Shared classes for every centred block. */
export const CENTERED_BASE_CLASS = "flex w-full min-w-0";
