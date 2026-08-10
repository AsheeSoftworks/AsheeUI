import type { DrawerConfig, DrawerSizeScale } from "./drawer-config";

export const defaultDrawerSizeScale: DrawerSizeScale = {
  default: "md",
  values: {
    sm: { width: { base: "20rem" }, height: { base: "20rem" } },
    md: { width: { base: "28rem" }, height: { base: "28rem" } },
    lg: { width: { base: "36rem" }, height: { base: "36rem" } },
    xl: { width: { base: "48rem" }, height: { base: "48rem" } },
    full: { width: { base: "100vw" }, height: { base: "100vh" } },
  },
};

export const defaultDrawerConfig: DrawerConfig = {
  size: defaultDrawerSizeScale,
  placement: "right",
  radius: "none",
  animation: "slide",
  closeOnOverlayClick: true,
  closeOnEsc: true,
};
