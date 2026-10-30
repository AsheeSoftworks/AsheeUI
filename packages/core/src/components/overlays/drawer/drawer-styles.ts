/**
 * The Drawer's class dictionaries, for the web renderer.
 *
 * The two renderers disagree about what a drawer is made of, and the disagreement is the
 * platform's. The web panel is a column at the side of the page whose size is a width, and its
 * other sizes are heights; the platform's panel is a sheet that comes up, so every size is a
 * height and the edge matters less than the room a thumb has.
 *
 * That is why the web's placement map is a map of two axes and the platform's is a map of the
 * two edges a sheet comes from. A side panel on a phone has no room to be a side panel, so the
 * platform's placement resolves a side to the sheet and keeps a top or bottom placement as the
 * edge the sheet comes from — the same rule the accordion and the carousel use for a treatment
 * they do not have.
 *
 * Every entry is a complete, static class string. An unprefixed `DRAWER_*` constant is the web
 * renderer's; `NATIVE_DRAWER_*` is the native renderer's.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { DrawerPlacement } from "./drawer-config";

/**
 * The web's slide animation for each placement.
 * Each class is a keyframe animation a consumer's stylesheet defines; the platform animates
 * the same movement with the modal presentation it already has.
 */
export const DRAWER_ANIMATION_STATE: Record<
  DrawerPlacement,
  { closed: string; open: string }
> = {
  right: {
    closed: "drawer-slide-right-closed",
    open: "drawer-slide-right-open",
  },
  left: {
    closed: "drawer-slide-left-closed",
    open: "drawer-slide-left-open",
  },
  top: {
    closed: "drawer-slide-top-closed",
    open: "drawer-slide-top-open",
  },
  bottom: {
    closed: "drawer-slide-bottom-closed",
    open: "drawer-slide-bottom-open",
  },
};

// ─── Native ───────────────────────────────────────────────────────────────────
