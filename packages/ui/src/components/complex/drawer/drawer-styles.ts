import type { DrawerPlacement, DrawerSizeKey } from "./drawer-config";

export const DRAWER_WIDTH_CLASS: Record<DrawerSizeKey, string> = {
  sm: "w-80",
  md: "w-[28rem]",
  lg: "w-[36rem]",
  xl: "w-[48rem]",
  full: "w-screen",
};

export const DRAWER_HEIGHT_CLASS: Record<DrawerSizeKey, string> = {
  sm: "h-80",
  md: "h-[28rem]",
  lg: "h-[36rem]",
  xl: "h-[48rem]",
  full: "h-screen",
};

export const DRAWER_RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
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
