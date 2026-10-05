/**
 * The Drawer's class dictionaries, for both renderers.
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
 */

import type { DrawerPlacement, DrawerSize } from "./drawer-config";

/** How wide a side panel is, on the web. */
export const DRAWER_WIDTH_CLASS: Record<DrawerSize, string> = {
  sm: "w-80",
  md: "w-[28rem]",
  lg: "w-[36rem]",
  full: "w-screen",
};

/** How tall a top or bottom panel is, on the web. */
export const DRAWER_HEIGHT_CLASS: Record<DrawerSize, string> = {
  sm: "h-80",
  md: "h-[28rem]",
  lg: "h-[36rem]",
  full: "h-screen",
};

/** Where the panel sits, per placement, on the web. */
export const DRAWER_CONTAINER_PLACEMENT_CLASS: Record<DrawerPlacement, string> =
  {
    right: "justify-end items-stretch",
    left: "justify-start items-stretch",
    top: "flex-col justify-start items-stretch",
    bottom: "flex-col justify-end items-stretch",
  };

/** The edge the panel is outlined on, per placement, on the web. */
export const DRAWER_BORDER_PLACEMENT_CLASS: Record<DrawerPlacement, string> = {
  right: "border-l",
  left: "border-r",
  top: "border-b",
  bottom: "border-t",
};

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

/**
 * The edge a native drawer's sheet comes from, per placement.
 *
 * A web drawer is a panel at the side of the page. A panel at the side of a phone has nowhere
 * to be, so the platform's placement resolves a side to the sheet it uses for this instead,
 * and keeps a top or bottom placement as the edge the sheet comes from.
 */
export const NATIVE_DRAWER_SHEET_EDGE: Record<
  DrawerPlacement,
  "top" | "bottom"
> = {
  right: "bottom",
  left: "bottom",
  bottom: "bottom",
  top: "top",
};

/** Where the sheet sits, per edge. */
export const NATIVE_DRAWER_EDGE_CLASS: Record<"top" | "bottom", string> = {
  top: "justify-start",
  bottom: "justify-end",
};

/** The edge the sheet is outlined on, per edge. */
export const NATIVE_DRAWER_BORDER_CLASS: Record<"top" | "bottom", string> = {
  top: "border-b border-border",
  bottom: "border-t border-border",
};

/**
 * How much of the screen the sheet takes.
 * Every size is a height on the platform, because the sheet is measured from the edge it comes
 * from rather than from a side of the page.
 */
export const NATIVE_DRAWER_SIZE_CLASS: Record<DrawerSize, string> = {
  sm: "h-1/3",
  md: "h-1/2",
  lg: "h-2/3",
  full: "h-full",
};

/** The layer behind the sheet, which dims the screen and can dismiss it. */
export const NATIVE_DRAWER_BACKDROP_CLASS = "flex-1 bg-foreground/30";

/** The sheet itself. */
export const NATIVE_DRAWER_SHEET_CLASS = "w-full bg-background p-4 gap-3";
