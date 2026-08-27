import type { TabsSizeKey } from "./tabs-config";

export const TABS_HEIGHT_CLASS: Record<TabsSizeKey, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
  xl: "h-14",
};

export const TABS_PADDING_X_CLASS: Record<TabsSizeKey, string> = {
  sm: "px-2.5",
  md: "px-3.5",
  lg: "px-4",
  xl: "px-5",
};

export const TABS_FONT_CLASS: Record<TabsSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};
