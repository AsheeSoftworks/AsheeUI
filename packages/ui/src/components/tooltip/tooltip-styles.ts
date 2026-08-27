import type { TooltipSizeKey } from "./tooltip-config";

export const TOOLTIP_PADDING_X_CLASS: Record<TooltipSizeKey, string> = {
  sm: "px-2",
  md: "px-3",
  lg: "px-4",
  xl: "px-5",
};

export const TOOLTIP_PADDING_Y_CLASS: Record<TooltipSizeKey, string> = {
  sm: "py-1",
  md: "py-1.5",
  lg: "py-2",
  xl: "py-2.5",
};

export const TOOLTIP_FONT_CLASS: Record<TooltipSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};
