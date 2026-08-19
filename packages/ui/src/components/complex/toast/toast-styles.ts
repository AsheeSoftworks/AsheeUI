import type { ToastSizeKey } from "./toast-config";

export const TOAST_WIDTH_CLASS: Record<ToastSizeKey, string> = {
  sm: "w-80",
  md: "w-96",
  lg: "w-[28rem]",
};

export const TOAST_PADDING_CLASS: Record<ToastSizeKey, string> = {
  sm: "p-3 px-4",
  md: "p-4 px-5",
  lg: "p-5 px-6",
};

export const TOAST_FONT_CLASS: Record<ToastSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
};

export const TOAST_TITLE_FONT_CLASS: Record<ToastSizeKey, string> = {
  sm: "text-sm font-semibold",
  md: "text-sm font-semibold",
  lg: "text-base font-semibold",
};

export const TOAST_RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};
