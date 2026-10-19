/**
 * Switch component styles for the web renderer.
 *
 * The class strings live in `@asheeui/core`, beside the native ones, because a
 * switch's proportions are part of the design language rather than of a renderer: a
 * track and the knob that travels across it are the same decision on both platforms.
 * This module re-exports them so the component keeps reading one module, and so what it
 * finds there is the same scale the native package compiles.
 */

export {
  SWITCH_THUMB_SIZE_CLASS,
  SWITCH_THUMB_TRANSLATE_CLASS,
  SWITCH_TRACK_SIZE_CLASS,
} from "@asheeui/core";
