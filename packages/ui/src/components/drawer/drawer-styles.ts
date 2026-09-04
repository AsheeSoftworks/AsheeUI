import type { DrawerPlacement, DrawerSize } from "./drawer-config";

export const DRAWER_WIDTH_CLASS: Record<DrawerSize, string> = {
  sm: "w-80",
  md: "w-[28rem]",
  lg: "w-[36rem]",
  xl: "w-[48rem]",
  full: "w-screen",
};

export const DRAWER_HEIGHT_CLASS: Record<DrawerSize, string> = {
  sm: "h-80",
  md: "h-[28rem]",
  lg: "h-[36rem]",
  xl: "h-[48rem]",
  full: "h-screen",
};

export const DRAWER_CONTAINER_PLACEMENT_CLASS: Record<DrawerPlacement, string> =
  {
    right: "justify-end items-stretch",
    left: "justify-start items-stretch",
    top: "flex-col justify-start items-stretch",
    bottom: "flex-col justify-end items-stretch",
  };

export const DRAWER_BORDER_PLACEMENT_CLASS: Record<DrawerPlacement, string> = {
  right: "border-l",
  left: "border-r",
  top: "border-b",
  bottom: "border-t",
};

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
