import type { ToastPlacement, ToastSizeKey } from "./toast-config";

export const TOAST_WIDTH_CLASS: Record<ToastSizeKey, string> = {
  sm: "w-72 max-w-full",
  md: "w-80 max-w-full",
  lg: "w-96 max-w-full",
};

export const TOAST_PADDING_CLASS: Record<ToastSizeKey, string> = {
  sm: "p-2.5",
  md: "p-3.5",
  lg: "p-4",
};

export const TOAST_FONT_CLASS: Record<ToastSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const TOAST_TITLE_FONT_CLASS: Record<ToastSizeKey, string> = {
  sm: "text-xs font-semibold",
  md: "text-sm font-semibold",
  lg: "text-base font-semibold",
};

// Simplified animation classes - just the placement and state
export const TOAST_ANIMATION_STATE: Record<
  ToastPlacement,
  { enter: string; exit: string }
> = {
  "top-right": {
    enter: "toast-enter-top-right",
    exit: "toast-exit-top-right",
  },
  "bottom-right": {
    enter: "toast-enter-bottom-right",
    exit: "toast-exit-bottom-right",
  },
  "top-left": {
    enter: "toast-enter-top-left",
    exit: "toast-exit-top-left",
  },
  "bottom-left": {
    enter: "toast-enter-bottom-left",
    exit: "toast-exit-bottom-left",
  },
  "top-center": {
    enter: "toast-enter-top-center",
    exit: "toast-exit-top-center",
  },
  "bottom-center": {
    enter: "toast-enter-bottom-center",
    exit: "toast-exit-bottom-center",
  },
};
