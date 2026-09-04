import type { SidebarSizeKey, SidebarVariant } from "./sidebar-config";

export const SIDEBAR_EXPANDED_WIDTH_CLASS: Record<SidebarSizeKey, string> = {
  sm: "w-56",
  md: "w-64",
  lg: "w-72",
};

export const SIDEBAR_COLLAPSED_WIDTH_CLASS: Record<SidebarSizeKey, string> = {
  sm: "w-16",
  md: "w-18",
  lg: "w-20",
};

export const SIDEBAR_HEADER_CLASS: Record<SidebarSizeKey, string> = {
  sm: "h-12 text-xs px-2.5",
  md: "h-14 text-sm px-3",
  lg: "h-16 text-base px-4",
};

export const SIDEBAR_SECTION_LABEL_CLASS: Record<SidebarSizeKey, string> = {
  sm: "text-[10px] px-2 py-1.5",
  md: "text-xs px-3 py-2",
  lg: "text-sm px-4 py-2.5",
};

export const SIDEBAR_ITEM_CLASS: Record<SidebarSizeKey, string> = {
  sm: "h-9 text-xs px-2",
  md: "h-11 text-sm px-3",
  lg: "h-13 text-base px-4",
};

export const SIDEBAR_VARIANT_CLASS: Record<SidebarVariant, string> = {
  default: "border-r border-border bg-background/80 backdrop-blur-xs",
  bordered: "border-r-2 border-border bg-background/80 backdrop-blur-xs",
  floating:
    "m-2 rounded-xl border border-border shadow-md bg-background/80 backdrop-blur-xs",
  ghost: "border-none bg-background/80 backdrop-blur-xs",
};
