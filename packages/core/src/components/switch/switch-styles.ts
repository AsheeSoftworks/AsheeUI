/**
 * The Switch's class dictionaries, for both renderers.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones,
 * side by side, because a switch's proportions are part of the design language
 * rather than part of a renderer: a track and the knob that travels across it are
 * the same decision on both platforms. The strings cannot be unified, and the prefix
 * says which is which — an unprefixed `SWITCH_*` constant is the web renderer's and a
 * `NATIVE_SWITCH_*` constant is the native one.
 *
 * The knob's travel is stated as a number rather than as a class, because a
 * transform is the one thing the platform animates itself: the renderer interpolates
 * the distance instead of asking for a class it would then have to have a keyframe
 * for. It is derived from the track and the knob, so the two maps above stay the only
 * statement of the proportions.
 */

import type { ColorRole } from "../../tokens";
import type { SwitchSizeKey } from "./switch-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * CSS classes for switch track size.
 * Maps size keys to Tailwind width, height, and padding classes.
 */
export const SWITCH_TRACK_SIZE_CLASS: Record<SwitchSizeKey, string> = {
  sm: "w-8 h-4.5 p-0.5",
  md: "w-11 h-6 p-0.5",
  lg: "w-14 h-7.5 p-1",
};

/**
 * CSS classes for switch thumb size.
 * Maps size keys to Tailwind width and height classes.
 */
export const SWITCH_THUMB_SIZE_CLASS: Record<SwitchSizeKey, string> = {
  sm: "size-3.5",
  md: "size-5",
  lg: "size-5.5",
};

/**
 * CSS classes for switch thumb translation.
 * Maps size keys to Tailwind translate classes that control how far
 * the thumb moves when checked.
 */
export const SWITCH_THUMB_TRANSLATE_CLASS: Record<SwitchSizeKey, string> = {
  sm: "translate-x-3.5",
  md: "translate-x-5",
  lg: "translate-x-6",
};

// ─── Native ───────────────────────────────────────────────────────────────────

/**
 * The track every native switch draws.
 *
 * It is a row, because the knob sits inside it and the platform lays that out as a
 * row rather than with absolute positioning, and it carries a border so an unset
 * track is still visible against its surface.
 */
export const NATIVE_SWITCH_TRACK_CLASS =
  "flex-row items-center border border-border/60";

/**
 * Track size for each density.
 *
 * The scale steps up from the web's, because a switch on a phone is hit with a thumb
 * rather than read from a pointer's distance: the smallest track is still wider than
 * the platform's minimum touch target is tall.
 */
export const NATIVE_SWITCH_TRACK_SIZE_CLASS: Record<SwitchSizeKey, string> = {
  sm: "w-9 h-5 p-0.5",
  md: "w-11 h-6 p-0.5",
  lg: "w-14 h-8 p-1",
};

/** The knob, which is the surface colour so it reads against whichever track it is on. */
export const NATIVE_SWITCH_THUMB_CLASS = "bg-background";

/**
 * Knob size for each density.
 */
export const NATIVE_SWITCH_THUMB_SIZE_CLASS: Record<SwitchSizeKey, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

/**
 * How far the knob travels when the switch is on, in pixels.
 *
 * The distance is the track's width less the knob's and less the padding on both
 * sides, which is what makes the maps above the single statement of the proportions:
 * a track that grows and a knob that does not would otherwise leave the knob short of
 * the end it is meant to reach.
 */
export const NATIVE_SWITCH_THUMB_TRAVEL: Record<SwitchSizeKey, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

/** The track colour of a switch that is on, per colour role. */
export const NATIVE_SWITCH_CHECKED_CLASS: Record<ColorRole, string> = {
  none: "bg-foreground",
  primary: "bg-primary",
  secondary: "bg-secondary",
  danger: "bg-danger",
  warning: "bg-warning",
  success: "bg-success",
};

/** The track colour of a switch that is off. */
export const NATIVE_SWITCH_UNCHECKED_CLASS = "bg-secondary";

/** The treatment of a switch that is unavailable. */
export const NATIVE_SWITCH_DISABLED_CLASS = "opacity-50";
