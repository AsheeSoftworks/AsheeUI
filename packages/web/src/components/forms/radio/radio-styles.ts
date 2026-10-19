/**
 * Radio component styles for the web renderer.
 *
 * The class strings live in `@asheeui/core`, beside the native ones, because a radio's
 * proportions are part of the design language: how large the circle is next to its label,
 * how far the label sits from it and what a checked circle is filled with are the same
 * decisions on both platforms. This module re-exports them so the component keeps
 * reading one module, and so what it finds there is the same scale the native package
 * compiles.
 */

export {
  RADIO_COLOR_CLASS,
  RADIO_FONT_SIZE_CLASS,
  RADIO_GAP_CLASS,
  RADIO_INNER_SIZE_CLASS,
  RADIO_OUTER_SIZE_CLASS,
  RADIO_STATUS_BORDER_CLASS,
} from "@asheeui/core";
