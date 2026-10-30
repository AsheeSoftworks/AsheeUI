/**
 * The Switch's class dictionaries, for the web renderer.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones,
 * side by side, because a switch's proportions are part of the design language
 * rather than part of a renderer: a track and the knob that travels across it are
 * the same decision on the web. The strings cannot be unified, and the prefix
 * says which is which — an unprefixed `SWITCH_*` constant is the web renderer's and a
 * `NATIVE_SWITCH_*` constant is the native one.
 *
 * The knob's travel is stated as a number rather than as a class, because a
 * transform is the one thing the platform animates itself: the renderer interpolates
 * the distance instead of asking for a class it would then have to have a keyframe
 * for. It is derived from the track and the knob, so the two maps above stay the only
 * statement of the proportions.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

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
