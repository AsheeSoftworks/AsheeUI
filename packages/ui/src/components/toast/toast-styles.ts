import type { ToastPlacement, ToastSizeKey } from "./toast-config";

export const TOAST_WIDTH_CLASS: Record<ToastSizeKey, string> = {
  sm: "w-72 max-w-full",
  md: "w-80 max-w-full",
  lg: "w-96 max-w-full",
  xl: "w-[28rem] max-w-full",
};

export const TOAST_PADDING_CLASS: Record<ToastSizeKey, string> = {
  sm: "p-2.5",
  md: "p-3.5",
  lg: "p-4",
  xl: "p-5",
};

export const TOAST_FONT_CLASS: Record<ToastSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export const TOAST_TITLE_FONT_CLASS: Record<ToastSizeKey, string> = {
  sm: "text-xs font-semibold",
  md: "text-sm font-semibold",
  lg: "text-base font-semibold",
  xl: "text-lg font-semibold",
};

export const TOAST_ANIMATION_CLASS: Record<ToastPlacement, string> = {
  "top-right":
    "animate-in fade-in-0 slide-in-from-right-8 duration-200 ease-out",
  "bottom-right":
    "animate-in fade-in-0 slide-in-from-right-8 duration-200 ease-out",
  "top-left": "animate-in fade-in-0 slide-in-from-left-8 duration-200 ease-out",
  "bottom-left":
    "animate-in fade-in-0 slide-in-from-left-8 duration-200 ease-out",
  "top-center":
    "animate-in fade-in-0 slide-in-from-top-8 duration-200 ease-out",
  "bottom-center":
    "animate-in fade-in-0 slide-in-from-bottom-8 duration-200 ease-out",
};
