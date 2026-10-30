/**
 * The web renderer's class dictionaries for drawer.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/overlays/drawer/drawer-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { DrawerPlacement, DrawerSize } from "@asheeui/core";

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
