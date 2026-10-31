/**
 * The web renderer's class dictionaries for modal.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/overlays/modal/modal-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { ModalPosition, ModalSizeKey } from "@asheeui/core";

/** How wide the modal is, on the web. */
export const MODAL_MAX_WIDTH_CLASS: Record<ModalSizeKey, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)]",
};

/** Where the modal sits, on the web. */
export const MODAL_POSITION_CLASS: Record<ModalPosition, string> = {
  center: "",
  top: "self-start mt-12",
  bottom: "self-end mb-12",
};
