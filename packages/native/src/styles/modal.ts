/**
 * The platform's class dictionaries for modal.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/overlays/modal/modal-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { ModalPosition, ModalSizeKey } from "@asheeui/core";

/**
 * How wide the modal is, on the platform.
 *
 * The web measures against the viewport; the platform measures against the screen it is
 * already drawn on, so `full` is that screen rather than a viewport with a gutter taken off.
 */
export const NATIVE_MODAL_WIDTH_CLASS: Record<ModalSizeKey, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full",
};

/** Where the modal sits, on the platform. */
export const NATIVE_MODAL_POSITION_CLASS: Record<ModalPosition, string> = {
  center: "justify-center",
  top: "justify-start pt-12",
  bottom: "justify-end pb-12",
};

/** The layer behind the modal, which dims the screen and can dismiss it. */
export const NATIVE_MODAL_BACKDROP_CLASS =
  "flex-1 items-center bg-foreground/30 p-4";

/** The modal surface itself. */
export const NATIVE_MODAL_PANEL_CLASS = "w-full bg-background p-4 gap-3";
