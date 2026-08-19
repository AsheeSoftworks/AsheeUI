import type { TabsSizeKey } from "./tabs-config";

export const TABS_HEIGHT_CLASS: Record<TabsSizeKey, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

export const TABS_PADDING_X_CLASS: Record<TabsSizeKey, string> = {
  sm: "px-2.5",
  md: "px-3.5",
  lg: "px-4",
};

export const TABS_FONT_CLASS: Record<TabsSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const TABS_RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};
