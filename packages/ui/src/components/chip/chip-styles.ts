import type { Size } from "../../shared/size";

export const CHIP_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-6",
  md: "h-7",
  lg: "h-8",
  xl: "h-10",
};

export const CHIP_PADDING_CLASS: Record<Size, string> = {
  sm: "px-2",
  md: "px-2.5",
  lg: "px-3",
  xl: "px-4",
};

export const CHIP_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export const CHIP_GAP_CLASS: Record<Size, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
  xl: "gap-2.5",
};

export const CHIP_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4 h-4",
  xl: "w-5 h-5",
};
