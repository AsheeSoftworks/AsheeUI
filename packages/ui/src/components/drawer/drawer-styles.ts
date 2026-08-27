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

export const DRAWER_ANIMATION_CLASSES: Record<
  "slide" | "zoom" | "fade",
  Record<DrawerPlacement, { closed: string; open: string }>
> = {
  slide: {
    right: {
      closed: "translate-x-full opacity-0",
      open: "translate-x-0 opacity-100",
    },
    left: {
      closed: "-translate-x-full opacity-0",
      open: "translate-x-0 opacity-100",
    },
    top: {
      closed: "-translate-y-full opacity-0",
      open: "translate-y-0 opacity-100",
    },
    bottom: {
      closed: "translate-y-full opacity-0",
      open: "translate-y-0 opacity-100",
    },
  },
  zoom: {
    right: {
      closed: "translate-x-8 scale-95 opacity-0",
      open: "translate-x-0 scale-100 opacity-100",
    },
    left: {
      closed: "-translate-x-8 scale-95 opacity-0",
      open: "translate-x-0 scale-100 opacity-100",
    },
    top: {
      closed: "-translate-y-8 scale-95 opacity-0",
      open: "translate-y-0 scale-100 opacity-100",
    },
    bottom: {
      closed: "translate-y-8 scale-95 opacity-0",
      open: "translate-y-0 scale-100 opacity-100",
    },
  },
  fade: {
    right: { closed: "opacity-0", open: "opacity-100" },
    left: { closed: "opacity-0", open: "opacity-100" },
    top: { closed: "opacity-0", open: "opacity-100" },
    bottom: { closed: "opacity-0", open: "opacity-100" },
  },
};
