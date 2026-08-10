import type { ModalConfig, ModalSizeScale } from "./modal-config";

export const defaultModalSizeScale: ModalSizeScale = {
  default: "md",
  values: {
    sm: {
      maxWidth: { base: "24rem" },
      padding: { base: "1.25rem" },
      radius: { base: "0.75rem" },
    },
    md: {
      maxWidth: { base: "32rem" },
      padding: { base: "1.5rem" },
      radius: { base: "0.75rem" },
    },
    lg: {
      maxWidth: { base: "42rem" },
      padding: { base: "1.75rem" },
      radius: { base: "1rem" },
    },
    xl: {
      maxWidth: { base: "56rem" },
      padding: { base: "2rem" },
      radius: { base: "1rem" },
    },
    full: {
      maxWidth: { base: "calc(100vw - 2rem)" },
      padding: { base: "2rem" },
      radius: { base: "1.25rem" },
    },
  },
};

export const defaultModalConfig: ModalConfig = {
  size: defaultModalSizeScale,
  position: "center",
  radius: "lg",
  animation: "pop",
  closeOnBackdropClick: true,
  closeOnEscape: true,
};
