import type { ToastConfig, ToastSizeScale } from "./toast-config";

export const defaultToastSizeScale: ToastSizeScale = {
  default: "md",
  values: {
    sm: {
      width: { base: "20rem" },
      padding: { base: "0.75rem 1rem" },
      fontSize: { base: "0.8125rem" },
      titleFontSize: { base: "0.875rem" },
    },
    md: {
      width: { base: "24rem" },
      padding: { base: "1rem 1.25rem" },
      fontSize: { base: "0.875rem" },
      titleFontSize: { base: "0.9375rem" },
    },
    lg: {
      width: { base: "28rem" },
      padding: { base: "1.25rem 1.5rem" },
      fontSize: { base: "0.9375rem" },
      titleFontSize: { base: "1rem" },
    },
  },
};

export const defaultToastConfig: ToastConfig = {
  size: defaultToastSizeScale,
  placement: "top-right",
  variant: "solid",
  radius: "md",
  animation: "slide",
  defaultTimeout: 3500,
  maxToasts: 5,
};
