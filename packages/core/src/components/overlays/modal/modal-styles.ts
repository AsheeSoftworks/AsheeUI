/**
 * The Modal's class dictionaries, for the web renderer.
 *
 * Both renderers answer the same two questions — how wide the surface is and where it sits —
 * and both answer them differently, because the measurement differs. The web states a maximum
 * width in the units CSS understands, including a width that reads the viewport; the platform
 * states a maximum width on a screen that is already the size it will be. The platform's
 * `full` is therefore the screen it has rather than the viewport minus a gutter.
 *
 * The position is stated the same way on both — where the surface is pushed to within the
 * space it is given — which is why the two maps read alike even though one is a flex
 * alignment and the other is a margin.
 *
 * Every entry is a complete, static class string. An unprefixed `MODAL_*` constant is the web
 * renderer's; `NATIVE_MODAL_*` is the native renderer's.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { ModalPosition, ModalSizeKey } from "./modal-config";

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

// ─── Native ───────────────────────────────────────────────────────────────────
