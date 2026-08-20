import type { ButtonSizeKey } from "./button-config";

export const BUTTON_SIZE_CLASS: Record<ButtonSizeKey, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-3.5 text-xs sm:h-10 sm:px-4 sm:text-sm gap-2",
  lg: "h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-base gap-2.5",
};

export const BUTTON_ICON_SIZE_CLASS: Record<ButtonSizeKey, string> = {
  sm: "size-8 p-0 text-xs gap-0",
  md: "size-9 sm:size-10 p-0 text-xs sm:text-sm gap-0",
  lg: "size-11 sm:size-12 p-0 text-sm sm:text-base gap-0",
};

export const BUTTON_RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};
